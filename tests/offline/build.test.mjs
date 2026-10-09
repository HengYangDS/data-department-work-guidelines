import assert from "node:assert/strict";
import childProcess from "node:child_process";
import {
  copyFileSync,
  existsSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { gunzipSync } from "node:zlib";
import { markdownTokens, walkMarkdown } from "../../tools/docs/markdown.mjs";
import { readNativeSupply, root } from "../../tools/docs/runtime.mjs";
import {
  assembleBundle,
  buildReleaseBundle,
} from "../../tools/ci/offline/build.mjs";
import {
  inspectBundle,
  sourceIdentity,
  validateBundleRecord,
} from "../../tools/ci/offline/artifact.mjs";
import { validateLockSupply } from "../../tools/ci/offline/npm.mjs";
import { record, source, buildFixture } from "../offline/fixtures.mjs";

test("release priming preserves native npm failures through the shared executor", (context) => {
  const actual = childProcess.spawnSync;
  let result;
  let output;
  let started = 0;
  let temporary;
  const mocks = [
    context.mock.method(process.stdout, "write", (bytes) => {
      output.stdout += bytes;
      return true;
    }),
    context.mock.method(process.stderr, "write", (bytes) => {
      output.stderr += bytes;
      return true;
    }),
    context.mock.method(childProcess, "spawnSync", (command, args, options) => {
      if (command !== process.execPath || args[1] !== "--version")
        return actual(command, args, options);
      started++;
      temporary = path.dirname(options.cwd);
      assert.equal(options.input, "");
      assert.equal(options.timeout, 10_000);
      return result;
    }),
  ];
  syncBuiltinESMExports();
  try {
    for (const response of [
      { status: 1, stdout: "npm partial result", stderr: "EBADDEVENGINES" },
      {
        status: null,
        signal: "SIGTERM",
        error: Object.assign(new Error("native npm timeout"), {
          code: "ETIMEDOUT",
        }),
        stdout: "npm partial result",
        stderr: "npm partial error",
      },
      { status: 0, stdout: "12.2.0", stderr: "native npm warning" },
    ]) {
      result = response;
      output = { stdout: "", stderr: "" };
      const before = started;
      buildFixture((inputs) => {
        copyFileSync(
          path.join(root, "package-lock.json"),
          path.join(inputs.repository, "package-lock.json"),
        );
        assert.throws(
          () => buildReleaseBundle(inputs),
          (error) => {
            assert.match(
              error.message,
              /exited 1|native npm timeout|warning output/u,
            );
            assert.equal(error.cause, response.error);
            return true;
          },
        );
      });
      assert.equal(started, before + 1, "failed startup must not begin npm ci");
      assert.equal(output.stdout, response.stdout);
      assert.equal(output.stderr, response.status === 0 ? "" : response.stderr);
      assert.equal(existsSync(temporary), false);
    }
  } finally {
    for (const mock of mocks) mock.mock.restore();
    syncBuiltinESMExports();
  }
});

test("builder admits only pinned, licensed, regular supply", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    assert.equal(built.version, "4.2.0");
    assert.match(built.sha256, /^[0-9a-f]{64}$/u);
    const checked = inspectBundle(
      inputs.outputPath,
      built,
      {
        version: built.version,
        lockSha256: built.lockSha256,
        packageJsonSha256: built.packageJsonSha256,
        nativeToolsSha256: built.nativeToolsSha256,
        nodeMajor: built.nodeMajor,
      },
      readNativeSupply(inputs.repository),
    );
    assert.equal(checked.sha256, built.sha256);
  });
  buildFixture((inputs) => {
    writeFileSync(
      path.join(inputs.assetDirectory, "lychee", inputs.assetName),
      "altered",
    );
    assert.throws(() => assembleBundle(inputs), /digest/u);
  });
  buildFixture((inputs) => {
    rmSync(path.join(inputs.licenseDirectory, "lychee", "LICENSE-MIT"));
    assert.throws(
      () => assembleBundle(inputs),
      (error) => {
        assert.match(error.message, /missing offline bundle license/u);
        assert.equal(error.cause?.code, "ENOENT");
        assert.equal(path.basename(error.cause.path), "LICENSE-MIT");
        return true;
      },
    );
  });
  buildFixture((inputs) => {
    const manifestPath = path.join(
      inputs.repository,
      ".config",
      "supply",
      "native.json",
    );
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.tools.lychee.assets[`${process.platform}-${process.arch}`].name =
      "../outside.tar.gz";
    writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.throws(() => assembleBundle(inputs), /unsafe.*asset/u);
  });
  buildFixture((inputs) => {
    const manifestPath = path.join(
      inputs.repository,
      ".config",
      "supply",
      "native.json",
    );
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.tools.lychee.licenses["../outside"] =
      manifest.tools.lychee.licenses["LICENSE-MIT"];
    writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.throws(() => assembleBundle(inputs), /unsafe.*license/u);
  });

  if (process.platform !== "win32") {
    buildFixture((inputs) => {
      symlinkSync(
        path.join(inputs.assetDirectory, "lychee", inputs.assetName),
        path.join(inputs.cacheDirectory, "_cacache", "index-v5", "link"),
      );
      assert.throws(() => assembleBundle(inputs), /symlink|regular/u);
    });
  }
});

test(
  "macOS builder omits extended attributes from the archive",
  { skip: process.platform !== "darwin" },
  () => {
    buildFixture((inputs) => {
      assembleBundle(inputs);
      const archive = gunzipSync(readFileSync(inputs.outputPath));
      assert.equal(archive.includes(Buffer.from("LIBARCHIVE.xattr.")), false);
      assert.equal(archive.includes(Buffer.from("SCHILY.xattr.")), false);
    });
  },
);

test("universal npm cache excludes platform and private supply", () => {
  const packageEntry = {
    resolved: "https://registry.npmjs.org/example/-/example-1.0.0.tgz",
    integrity: `sha512-${Buffer.alloc(64).toString("base64")}`,
  };
  const lock = {
    lockfileVersion: 3,
    packages: { "": {}, "node_modules/example": packageEntry },
  };
  assert.equal(validateLockSupply(lock), 1);
  for (const changed of [
    { resolved: "http://registry.npmjs.org/example.tgz" },
    { resolved: "https://user:pass@registry.npmjs.org/example.tgz" },
    { resolved: "https://registry.npmjs.org/example.tgz?token=fixture" },
    { resolved: "https://other.example.test/example.tgz" },
    { optional: true },
    { os: ["darwin"] },
    { cpu: ["arm64"] },
    { hasInstallScript: true },
    { integrity: "" },
  ]) {
    assert.throws(() =>
      validateLockSupply({
        ...lock,
        packages: {
          ...lock.packages,
          "node_modules/example": { ...packageEntry, ...changed },
        },
      }),
    );
  }
});

test("offline builder publishes exclusively without changing another attempt's archive", (context) => {
  buildFixture((inputs) => {
    const originalSpawn = childProcess.spawnSync;
    const priorBytes = Buffer.from("another attempt owns this output");
    const replacement = context.mock.method(
      childProcess,
      "spawnSync",
      (command, args, options) => {
        if (command === "tar" && args.includes("-czf")) {
          writeFileSync(inputs.outputPath, priorBytes, { flag: "wx" });
        }
        return originalSpawn(command, args, options);
      },
    );
    syncBuiltinESMExports();
    try {
      assert.throws(
        () => assembleBundle(inputs),
        /offline bundle output already exists/u,
      );
      assert.deepEqual(readFileSync(inputs.outputPath), priorBytes);
    } finally {
      replacement.mock.restore();
      syncBuiltinESMExports();
    }
  });
});

test("release route records the bundle before inspecting it", () => {
  const guide = readFileSync(path.join(root, "CONTRIBUTING.md"), "utf8");
  const build = guide.indexOf("node tools/ci/offline-bundle.mjs build");
  const record = guide.indexOf("Put that exact reviewed JSON");
  const inspect = guide.indexOf(
    "node tools/ci/offline-bundle.mjs inspect --bundle BUNDLE_PATH",
  );
  assert.ok(build >= 0 && record > build && inspect > record);
});

test("release route runs the full source check after bundle identity is updated", () => {
  const guide = readFileSync(path.join(root, "CONTRIBUTING.md"), "utf8");
  const release = guide.split("## Publish a release")[1];
  assert.ok(release);
  const record = release.indexOf("Put that exact reviewed JSON");
  const verify = release.indexOf("`npm run verify`");
  assert.ok(record >= 0 && verify > record);
});

test("release route commits source before a clean-checkout install", () => {
  const guide = readFileSync(
    path.join(root, "CONTRIBUTING.md"),
    "utf8",
  ).replace(/\s+/gu, " ");
  const commit = guide.indexOf("Commit with the configured trusted SSH signer");
  const cold = guide.indexOf("From a fresh checkout of the committed source");
  assert.ok(commit >= 0 && cold > commit);
});

test("release route requires both Forge source matrices before tagging", () => {
  const guide = readFileSync(
    path.join(root, "CONTRIBUTING.md"),
    "utf8",
  ).replace(/\s+/gu, " ");
  const source = guide.indexOf("require every declared source job to pass");
  const tag = guide.indexOf("Only then sign an annotated");
  assert.ok(source >= 0 && tag > source);
});

test("release route binds GitLab commands and exact pipeline readback", () => {
  const guide = readFileSync(path.join(root, "CONTRIBUTING.md"), "utf8");
  const commands = [...walkMarkdown(markdownTokens(guide, "CONTRIBUTING.md"))]
    .filter((node) => ["codeFlowValue", "codeTextData"].includes(node.type))
    .map((node) => node.text.trim().split(/\s+/u))
    .filter(([executable]) => executable === "glab");
  assert.ok(commands.length > 0);
  for (const command of commands) {
    if (command[1] === "auth") continue;
    const repository =
      command[1] === "repo" && command[2] === "view"
        ? command[3]
        : command[command.indexOf("--repo") + 1];
    assert.equal(repository, "GITLAB_REPOSITORY_URL", command.join(" "));
  }
  assert.ok(
    commands.some(
      (command) =>
        command[1] === "ci" &&
        command[2] === "get" &&
        command[command.indexOf("--pipeline-id") + 1] === "PIPELINE_ID" &&
        command[command.indexOf("--output") + 1] === "json",
    ),
  );
});

test("offline supply binds the native package-manager policy bytes", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, "package.json"),
      JSON.stringify({
        engines: { node: "26.x" },
        devEngines: {
          packageManager: { name: "npm", version: "0.0.0", onFail: "error" },
        },
      }),
    );
    assert.throws(
      () => validateBundleRecord(built, sourceIdentity(inputs.repository)),
      /source/u,
    );
  });
});
