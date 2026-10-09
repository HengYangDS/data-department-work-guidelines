import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { strictVersion } from "../../tools/docs/changelog.mjs";
import { declaredToolRuntime, root } from "../../tools/docs/runtime.mjs";
import {
  isolatedNpmEnvironment,
  npmCliPath,
} from "../../tools/ci/offline/npm.mjs";
import { assertNpmResult } from "../offline/fixtures.mjs";

test("Node owns the package-manager bootstrap without a duplicate npm major", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-runtime-"));
  try {
    writeFileSync(
      path.join(directory, "package.json"),
      JSON.stringify({ engines: { node: "26.x" } }),
    );
    assert.deepEqual(declaredToolRuntime(directory), { nodeMajor: 26 });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("npm CLI is a JavaScript entrypoint on POSIX and Windows layouts", () => {
  const actual = npmCliPath();
  assert.equal(path.basename(actual), "npm-cli.js");
  const version = spawnSync(process.execPath, [actual, "--version"], {
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.equal(version.status, 0, version.stderr);
  assert.match(version.stdout, /^[1-9]\d*\.\d+\.\d+\s*$/u);
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-npm-layout-"));
  try {
    const cli = path.join(
      directory,
      "node_modules",
      "npm",
      "bin",
      "npm-cli.js",
    );
    mkdirSync(path.dirname(cli), { recursive: true });
    writeFileSync(path.join(directory, "npm.cmd"), "fixture");
    writeFileSync(cli, "fixture");
    assert.equal(
      npmCliPath({
        platform: "win32",
        pathValue: directory,
        npmExecPath: null,
      }),
      realpathSync(cli),
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("npm entrypoint follows its native execution and Windows prefix authority", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-npm-authority-"));
  try {
    const adjacent = path.join(
      directory,
      "node_modules",
      "npm",
      "bin",
      "npm-cli.js",
    );
    const prefix = path.join(directory, "global-prefix");
    const selected = path.join(
      prefix,
      "node_modules",
      "npm",
      "bin",
      "npm-cli.js",
    );
    for (const file of [adjacent, selected]) {
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, "fixture");
    }
    writeFileSync(
      path.join(directory, "npm.cmd"),
      'SET "NPM_PREFIX_JS=%~dp0\\node_modules\\npm\\bin\\npm-prefix.js"',
    );
    writeFileSync(
      path.join(path.dirname(adjacent), "npm-prefix.js"),
      `process.stdout.write(${JSON.stringify(prefix)})`,
    );
    assert.equal(
      npmCliPath({
        platform: "win32",
        pathValue: directory,
        npmExecPath: null,
      }),
      realpathSync(selected),
    );
    assert.equal(
      npmCliPath({ pathValue: directory, npmExecPath: selected }),
      realpathSync(selected),
    );
    assert.throws(
      () =>
        npmCliPath({
          pathValue: directory,
          npmExecPath: path.join(directory, "missing.js"),
        }),
      /native npm execution entrypoint/u,
    );
    writeFileSync(
      path.join(path.dirname(adjacent), "npm-prefix.js"),
      "process.exit(1)",
    );
    assert.throws(
      () =>
        npmCliPath({
          platform: "win32",
          pathValue: directory,
          npmExecPath: null,
        }),
      /native Windows npm prefix/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("a direct Windows npm shim does not inherit the bundled prefix route", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-npm-shim-"));
  try {
    const selected = path.join(
      directory,
      "node_modules",
      "npm",
      "bin",
      "npm-cli.js",
    );
    const prefix = path.join(directory, "bundled-prefix");
    const bundled = path.join(
      prefix,
      "node_modules",
      "npm",
      "bin",
      "npm-cli.js",
    );
    for (const file of [selected, bundled]) {
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, "fixture");
    }
    // npm's cmd-shim calls its declared entry directly, unlike npm.cmd's
    // installer-specific NPM_PREFIX_JS route.
    writeFileSync(
      path.join(directory, "npm.cmd"),
      '"%_prog%" "%dp0%\\node_modules\\npm\\bin\\npm-cli.js" %*',
    );
    writeFileSync(
      path.join(path.dirname(selected), "npm-prefix.js"),
      `process.stdout.write(${JSON.stringify(prefix)})`,
    );
    assert.equal(
      npmCliPath({
        platform: "win32",
        pathValue: directory,
        npmExecPath: null,
      }),
      realpathSync(selected),
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("npm resolution skips non-launcher directories and refuses a broken selected launcher", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-npm-selection-"));
  try {
    const stale = path.join(directory, "stale");
    const selected = path.join(directory, "selected");
    for (const location of [stale, selected]) {
      const cli = path.join(location, "node_modules/npm/bin/npm-cli.js");
      mkdirSync(path.dirname(cli), { recursive: true });
      writeFileSync(cli, "fixture");
    }
    const selectedCli = path.join(selected, "node_modules/npm/bin/npm-cli.js");
    writeFileSync(path.join(selected, "npm.cmd"), "fixture");
    assert.equal(
      npmCliPath({
        platform: "win32",
        pathValue: [stale, selected].join(path.delimiter),
        npmExecPath: null,
      }),
      realpathSync(selectedCli),
    );
    for (const [platform, launcher] of [
      ["win32", "npm.cmd"],
      ["linux", "npm"],
    ]) {
      mkdirSync(path.join(stale, launcher));
      if (launcher === "npm") {
        writeFileSync(path.join(selected, launcher), "fixture", {
          mode: 0o755,
        });
      }
      assert.equal(
        npmCliPath({
          platform,
          pathValue: [stale, selected].join(path.delimiter),
          npmExecPath: null,
        }),
        realpathSync(selectedCli),
      );
      rmSync(path.join(stale, launcher), { recursive: true });
    }
    rmSync(path.join(stale, "node_modules"), { recursive: true });
    writeFileSync(path.join(stale, "npm.cmd"), "broken fixture");
    assert.throws(
      () =>
        npmCliPath({
          platform: "win32",
          pathValue: [stale, selected].join(path.delimiter),
          npmExecPath: null,
        }),
      /selected npm launcher.*entrypoint/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("npm owns exact package-manager admission without duplicate fields", () => {
  const manifest = JSON.parse(
    readFileSync(path.join(root, "package.json"), "utf8"),
  );
  assert.deepEqual(manifest.devEngines?.packageManager, {
    name: "npm",
    version: "12.2.0",
    onFail: "error",
  });
  assert.equal(manifest.packageManager, undefined);
  assert.equal(manifest.engines?.npm, undefined);
});

test("native npm result assertions preserve process failure diagnostics", () => {
  const result = {
    status: null,
    signal: "SIGTERM",
    error: Object.assign(new Error("native npm timed out"), {
      code: "ETIMEDOUT",
      path: process.execPath,
      syscall: "spawnSync",
    }),
    stdout: "partial native npm stdout",
    stderr: "partial native npm stderr",
  };
  assert.throws(
    () => assertNpmResult(result, 1, ["install", "--ignore-scripts"]),
    (error) => {
      for (const value of [
        "install",
        "SIGTERM",
        "ETIMEDOUT",
        "spawnSync",
        "partial native npm stdout",
        "partial native npm stderr",
        JSON.stringify(process.execPath).slice(1, -1),
      ]) {
        assert.ok(
          error.message.includes(value),
          `missing diagnostic: ${value}`,
        );
      }
      return true;
    },
  );
  assert.doesNotThrow(() =>
    assertNpmResult({ status: 1, stderr: "native npm refusal" }, 1, ["ci"]),
  );
});

test("native npm rejects mismatched install, ci, and run before effects", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-npm-admission-"));
  try {
    const marker = path.join(directory, "effect");
    const manifest = {
      name: "native-admission-fixture",
      version: "1.0.0",
      private: true,
      scripts: {
        effect:
          "node -e \"require('node:fs').writeFileSync('effect', 'unexpected')\"",
      },
      devEngines: {
        packageManager: { name: "npm", version: "0.0.0", onFail: "error" },
      },
    };
    writeFileSync(
      path.join(directory, "package.json"),
      JSON.stringify(manifest),
    );
    writeFileSync(
      path.join(directory, "package-lock.json"),
      JSON.stringify({
        name: manifest.name,
        version: manifest.version,
        lockfileVersion: 3,
        packages: { "": { name: manifest.name, version: manifest.version } },
      }),
    );
    const cli = npmCliPath();
    const env = isolatedNpmEnvironment(
      directory,
      path.join(directory, "cache"),
    );
    for (const args of [
      ["install", "--ignore-scripts"],
      ["ci", "--ignore-scripts"],
      ["run", "effect"],
    ]) {
      const result = spawnSync(process.execPath, [cli, ...args], {
        cwd: directory,
        env,
        encoding: "utf8",
        timeout: 15_000,
        input: "",
      });
      const diagnostic = assertNpmResult(result, 1, args);
      assert.match(result.stderr, /EBADDEVENGINES/u, diagnostic);
      assert.equal(existsSync(marker), false, diagnostic);
      assert.equal(
        existsSync(path.join(directory, "node_modules")),
        false,
        diagnostic,
      );
    }
    const version = spawnSync(process.execPath, [cli, "--version"], {
      cwd: directory,
      env,
      encoding: "utf8",
      timeout: 10_000,
      input: "",
    });
    const versionDiagnostic = assertNpmResult(version, 0, ["--version"]);
    const versionText = version.stdout.trim();
    assert.doesNotThrow(() => strictVersion(versionText), versionDiagnostic);
    manifest.devEngines.packageManager.version = versionText;
    writeFileSync(
      path.join(directory, "package.json"),
      JSON.stringify(manifest),
    );
    for (const args of [
      ["install", "--ignore-scripts"],
      ["ci", "--ignore-scripts"],
    ]) {
      const result = spawnSync(process.execPath, [cli, ...args], {
        cwd: directory,
        env,
        encoding: "utf8",
        timeout: 15_000,
        input: "",
      });
      assertNpmResult(result, 0, args);
    }
    const allowed = spawnSync(process.execPath, [cli, "run", "effect"], {
      cwd: directory,
      env,
      encoding: "utf8",
      timeout: 15_000,
      input: "",
    });
    const allowedDiagnostic = assertNpmResult(allowed, 0, ["run", "effect"]);
    assert.equal(existsSync(marker), true, allowedDiagnostic);
    assert.equal(readFileSync(marker, "utf8"), "unexpected", allowedDiagnostic);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
