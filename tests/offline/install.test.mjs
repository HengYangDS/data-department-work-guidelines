import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { readNativeSupply, root } from "../../tools/docs/runtime.mjs";
import { assembleBundle } from "../../tools/ci/offline/build.mjs";
import { installBundle } from "../../tools/ci/offline/install.mjs";
import { npmCliPath } from "../../tools/ci/offline/npm.mjs";
import { digest, buildFixture } from "../offline/fixtures.mjs";

test("the public offline installer reports its actual package-manager version", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, ".config/release/offline-bundle.json"),
      JSON.stringify(built),
    );
    for (const relative of [
      "tools/ci/offline-bundle.mjs",
      "tools/ci/offline/artifact.mjs",
      "tools/ci/offline/npm.mjs",
      "tools/ci/offline/build.mjs",
      "tools/ci/offline/install.mjs",
      "tools/ci/offline/acquire.mjs",
      "tools/ci/gitlab-package.mjs",
      "tools/docs/runtime.mjs",
    ]) {
      const target = path.join(inputs.repository, relative);
      mkdirSync(path.dirname(target), { recursive: true });
      copyFileSync(path.join(root, relative), target);
    }
    const bootstrap = path.join(
      inputs.repository,
      "native install #fixture.mjs",
    );
    writeFileSync(
      bootstrap,
      `import childProcess from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import path from "node:path";
const actual = childProcess.spawnSync;
childProcess.spawnSync = (command, args, options) => {
  if (command === process.execPath) {
    if (path.basename(args[0]) === "npm-cli.js") {
      if (args[1] === "--version")
        return { status: 0, stdout: "12.1.0\\n", stderr: "" };
      if (args[1] === "ci") {
        mkdirSync(path.join(options.cwd, "node_modules"));
        return { status: 0, stdout: "", stderr: "" };
      }
    }
    if (path.basename(args[0]) === "install-native.mjs") {
      const tool = args[1];
      const native = JSON.parse(readFileSync(path.join(options.cwd, ".config/supply/native.json"), "utf8"));
      const descriptor = native.tools[tool];
      const target = path.join(options.cwd, "build/runtime/tool-cache", tool, descriptor.version,
        process.platform + "-" + process.arch, descriptor.binary + (process.platform === "win32" ? ".exe" : ""));
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, "verified native fixture");
      return { status: 0, stdout: "", stderr: "" };
    }
  }
  return actual(command, args, options);
};
syncBuiltinESMExports();
`,
    );
    const result = spawnSync(
      process.execPath,
      [
        "--import",
        pathToFileURL(bootstrap).href,
        "tools/ci/offline-bundle.mjs",
        "install",
        "--bundle",
        inputs.outputPath,
      ],
      { cwd: inputs.repository, encoding: "utf8", timeout: 30_000 },
    );
    assert.equal(result.error, undefined, result.stderr);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, "");
    assert.equal(
      result.stdout,
      `PASS offline install: 4.2.0 ${built.sha256} npm 12.1.0\n`,
    );
    assert.ok(existsSync(path.join(inputs.repository, "node_modules")));
  });
});

test("installer invokes only the locked offline supply path", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const calls = [];
    const commandRunner = (command, args, options) => {
      calls.push({ command, args, options });
      if (
        command === process.execPath &&
        path.basename(args[0]) === "npm-cli.js" &&
        args[1] === "--version"
      )
        return "12.1.0\n";
      if (
        command === process.execPath &&
        path.basename(args[0]) === "npm-cli.js" &&
        args[1] === "ci"
      ) {
        assert.ok(args.includes("--offline"));
        assert.ok(args.includes("--ignore-scripts"));
        assert.ok(args.includes("--cache"));
        assert.ok(!args.includes("--dry-run"));
        mkdirSync(path.join(inputs.repository, "node_modules"));
        assert.equal(options.env.npm_config_offline, "true");
        assert.equal(options.env.npm_config_force, "false");
        assert.notEqual(
          options.env.npm_config_userconfig,
          options.env.npm_config_globalconfig,
        );
      }
      if (
        command === process.execPath &&
        path.basename(args[0]) === "install-native.mjs"
      ) {
        const descriptor = readNativeSupply(inputs.repository).tools[args[1]];
        const target = path.join(
          inputs.repository,
          "build/runtime/tool-cache",
          args[1],
          descriptor.version,
          `${process.platform}-${process.arch}`,
          descriptor.binary + (process.platform === "win32" ? ".exe" : ""),
        );
        mkdirSync(path.dirname(target), { recursive: true });
        writeFileSync(target, "verified native fixture");
      }
      return "";
    };
    const result = installBundle({
      bundlePath: inputs.outputPath,
      record: built,
      repository: inputs.repository,
      commandRunner,
    });
    assert.equal(result.version, "4.2.0");
    assert.equal(result.npmVersion, "12.1.0");
    assert.equal(calls.length, 4);
    assert.equal(calls[0].command, process.execPath);
    assert.equal(path.basename(calls[0].args[0]), "npm-cli.js");
    assert.equal(calls[0].args[1], "--version");
    assert.equal(calls[1].command, process.execPath);
    assert.equal(path.basename(calls[1].args[0]), "npm-cli.js");
    assert.equal(calls[1].args[1], "ci");
    assert.equal(calls[2].command, process.execPath);
    assert.equal(
      calls[2].args[0],
      path.join(inputs.repository, "tools", "ci", "install-native.mjs"),
    );
    assert.deepEqual(calls[2].args.slice(1, 3), ["lychee", "--asset"]);
    assert.deepEqual(calls[3].args.slice(1, 3), ["vale", "--asset"]);
  });
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const calls = [];
    const commandRunner = (command, args) => {
      calls.push([command, path.basename(args[0]), args[1]]);
      if (args[1] === "--version") return "12.1.0\n";
      throw new Error("simulated offline cache miss");
    };
    assert.throws(
      () =>
        installBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
          commandRunner,
        }),
      /offline cache miss/u,
    );
    assert.deepEqual(calls, [
      [process.execPath, "npm-cli.js", "--version"],
      [process.execPath, "npm-cli.js", "ci"],
    ]);
  });
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    mkdirSync(path.join(inputs.repository, "node_modules"));
    assert.throws(
      () =>
        installBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
          commandRunner: () => {
            throw new Error("must not run");
          },
        }),
      /node_modules/u,
    );
  });
});

test("Windows ARM64 offline installation consumes the pinned compatible assets", () => {
  buildFixture((inputs) => {
    const native = readNativeSupply(inputs.repository);
    const rawTool = readNativeSupply().tools["osv-scanner"];
    const rawBytes = Buffer.from("pinned OSV binary fixture");
    const rawLicense = Buffer.from("OSV license fixture");
    const rawName = rawTool.assets["win32-x64"].name;
    mkdirSync(path.join(inputs.assetDirectory, "osv-scanner"));
    mkdirSync(path.join(inputs.licenseDirectory, "osv-scanner"));
    writeFileSync(
      path.join(inputs.assetDirectory, "osv-scanner", rawName),
      rawBytes,
    );
    writeFileSync(
      path.join(inputs.licenseDirectory, "osv-scanner", "LICENSE"),
      rawLicense,
    );
    native.tools["osv-scanner"] = {
      version: rawTool.version,
      binary: rawTool.binary,
      format: rawTool.format,
      versionOutput: rawTool.versionOutput,
      assets: {
        "win32-x64": {
          name: rawName,
          sha256: digest(rawBytes),
          size: rawBytes.byteLength,
        },
      },
      licenses: {
        LICENSE: {
          sha256: digest(rawLicense),
          source: "https://example.test/osv-scanner/LICENSE",
        },
      },
    };
    const host = `${process.platform}-${process.arch}`;
    for (const descriptor of Object.values(native.tools)) {
      if (descriptor.assets[host]) {
        descriptor.assets["win32-x64"] = descriptor.assets[host];
        if (host !== "win32-x64") delete descriptor.assets[host];
      }
    }
    writeFileSync(
      path.join(inputs.repository, ".config/supply/native.json"),
      JSON.stringify(native),
    );
    const built = assembleBundle(inputs);
    const npmEntry = npmCliPath();
    const previous = {
      platform: Object.getOwnPropertyDescriptor(process, "platform"),
      arch: Object.getOwnPropertyDescriptor(process, "arch"),
      npmExecPath: process.env.npm_execpath,
    };
    const calls = [];
    try {
      Object.defineProperty(process, "platform", {
        ...previous.platform,
        value: "win32",
      });
      Object.defineProperty(process, "arch", {
        ...previous.arch,
        value: "arm64",
      });
      process.env.npm_execpath = npmEntry;
      const result = installBundle({
        bundlePath: inputs.outputPath,
        record: built,
        repository: inputs.repository,
        commandRunner(command, args, options) {
          assert.equal(command, process.execPath);
          calls.push(args);
          if (path.basename(args[0]) === "npm-cli.js") {
            if (args[1] === "--version") return "12.1.0\n";
            assert.equal(args[1], "ci");
            assert.ok(args.includes("--offline"));
            mkdirSync(path.join(inputs.repository, "node_modules"));
          } else {
            assert.equal(path.basename(args[0]), "install-native.mjs");
            const descriptor = native.tools[args[1]];
            if (args[1] === "osv-scanner") {
              assert.equal(descriptor.format, "binary");
              assert.deepEqual(readFileSync(args[3]), rawBytes);
              assert.equal(
                descriptor.assets["win32-x64"].size,
                rawBytes.byteLength,
              );
            }
            assert.deepEqual(args.slice(2, 3), ["--asset"]);
            assert.equal(
              path.basename(args[3]),
              descriptor.assets["win32-x64"].name,
            );
            const target = path.join(
              inputs.repository,
              "build/runtime/tool-cache",
              args[1],
              descriptor.version,
              "win32-x64",
              descriptor.binary + ".exe",
            );
            mkdirSync(path.dirname(target), { recursive: true });
            writeFileSync(target, "verified native fixture");
          }
          assert.equal(options.cwd, inputs.repository);
          return "";
        },
      });
      assert.equal(result.npmVersion, "12.1.0");
      assert.equal(calls.length, 5);
      assert.deepEqual(
        calls.slice(2).map((args) => args[1]),
        ["lychee", "vale", "osv-scanner"],
      );
      assert.equal(
        existsSync(
          path.join(inputs.repository, "build/runtime/.offline-install"),
        ),
        false,
      );
    } finally {
      Object.defineProperty(process, "platform", previous.platform);
      Object.defineProperty(process, "arch", previous.arch);
      if (previous.npmExecPath === undefined) delete process.env.npm_execpath;
      else process.env.npm_execpath = previous.npmExecPath;
    }
  });
});

test("offline installation refuses an unsupported tool ABI before package-manager effects", () => {
  buildFixture((inputs) => {
    const native = readNativeSupply(inputs.repository);
    const platform = `${process.platform}-${process.arch}`;
    const otherPlatform =
      platform === "linux-arm64" ? "win32-x64" : "linux-arm64";
    native.tools.lychee.assets[otherPlatform] =
      native.tools.lychee.assets[platform];
    delete native.tools.lychee.assets[platform];
    writeFileSync(
      path.join(inputs.repository, ".config/supply/native.json"),
      JSON.stringify(native),
    );
    const built = assembleBundle(inputs);
    const calls = [];
    assert.throws(
      () =>
        installBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
          commandRunner: (command, args, options) => {
            calls.push({ command, args });
            if (args[1] === "--version") return "12.1.0\n";
            if (args[1] === "ci")
              mkdirSync(path.join(options.cwd, "node_modules"));
            return "";
          },
        }),
      /unsupported lychee platform/u,
    );
    assert.deepEqual(calls, []);
    assert.equal(
      existsSync(path.join(inputs.repository, "node_modules")),
      false,
    );
  });
});
