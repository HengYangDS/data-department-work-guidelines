import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import fs from "node:fs";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { root } from "../../tools/docs/runtime.mjs";
import { acquireGitHubBundle } from "../../tools/ci/offline/acquire.mjs";
import {
  assembleBundle,
  buildReleaseBundle,
} from "../../tools/ci/offline/build.mjs";
import { installBundle } from "../../tools/ci/offline/install.mjs";
import { npmCliPath } from "../../tools/ci/offline/npm.mjs";
import { verifyBundle } from "../../tools/ci/offline/artifact.mjs";
import { buildFixture } from "../offline/fixtures.mjs";

test("offline installation requires the managed native output after a successful child", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const installedTools = [];
    assert.throws(
      () =>
        installBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
          commandRunner: (command, args, options) => {
            if (path.basename(args[0]) === "npm-cli.js") {
              if (args[1] === "--version") return "12.1.0\n";
              if (args[1] === "ci")
                mkdirSync(path.join(options.cwd, "node_modules"));
            } else if (path.basename(args[0]) === "install-native.mjs") {
              installedTools.push(args[1]);
            }
            return "";
          },
        }),
      /native install returned without managed lychee/u,
    );
    assert.deepEqual(installedTools, ["lychee"]);
    assert.equal(
      existsSync(path.join(inputs.repository, "node_modules")),
      false,
    );
  });
});

test("an empty npm cache cannot satisfy the actual offline install", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-empty-cache-"));
  try {
    for (const name of ["package.json", "package-lock.json"]) {
      copyFileSync(path.join(root, name), path.join(directory, name));
    }
    const cache = path.join(directory, "cache");
    mkdirSync(cache);
    const userConfig = path.join(directory, "empty-user.npmrc");
    const globalConfig = path.join(directory, "empty-global.npmrc");
    writeFileSync(userConfig, "");
    writeFileSync(globalConfig, "");
    // Windows environment keys are case-insensitive; an inherited
    // NPM_CONFIG_CACHE can otherwise override this test's empty cache.
    const inheritedEnvironment = Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) =>
          !/^npm_config_/iu.test(key) &&
          !["NPM_TOKEN", "NODE_AUTH_TOKEN"].includes(key),
      ),
    );
    const result = spawnSync(
      process.execPath,
      [
        npmCliPath(),
        "ci",
        "--offline",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
      ],
      {
        cwd: directory,
        encoding: "utf8",
        timeout: 30_000,
        env: {
          ...inheritedEnvironment,
          npm_config_cache: cache,
          npm_config_userconfig: userConfig,
          npm_config_globalconfig: globalConfig,
          npm_config_offline: "true",
          npm_config_audit: "false",
          npm_config_fund: "false",
          npm_config_update_notifier: "false",
        },
      },
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ENOTCACHED/u);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("concurrent offline installs refuse before effects across processes and release their reservation", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const originalFailure = new Error(
      "first install deliberately failed before npm ci",
    );
    const marker = path.join(inputs.repository, "second-installer-effect");
    let second;
    assert.throws(
      () =>
        installBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
          commandRunner: () => {
            second = spawnSync(
              process.execPath,
              [
                "--input-type=module",
                "-e",
                `
import { installBundle } from ${JSON.stringify(pathToFileURL(path.join(root, "tools/ci/offline/install.mjs")).href)};
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
try {
  installBundle({
    bundlePath: ${JSON.stringify(inputs.outputPath)},
    record: ${JSON.stringify(built)},
    repository: ${JSON.stringify(inputs.repository)},
    commandRunner: (_command, args) => {
      writeFileSync(${JSON.stringify(marker)}, "second attempt reached npm");
      if (args[1] === "--version") return "12.2.0\\n";
      if (args[1] === "ci") mkdirSync(path.join(${JSON.stringify(inputs.repository)}, "node_modules"));
      throw new Error("unreserved second install reached mutation");
    },
  });
  process.exitCode = 40;
} catch (error) {
  console.log(error.message);
  process.exitCode = /offline installation already in progress/.test(error.message) ? 41 : 42;
}
`,
              ],
              { encoding: "utf8", timeout: 30_000 },
            );
            throw originalFailure;
          },
        }),
      (error) => error === originalFailure,
    );
    assert.equal(second.error, undefined, second.stderr);
    assert.equal(second.status, 41, second.stdout + second.stderr);
    assert.equal(existsSync(marker), false);
    assert.equal(
      existsSync(path.join(inputs.repository, "node_modules")),
      false,
    );
    assert.deepEqual(
      readdirSync(path.join(inputs.repository, "build/runtime")),
      [],
    );
    assert.throws(
      () =>
        installBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
          commandRunner: () => {
            throw originalFailure;
          },
        }),
      (error) => error === originalFailure,
    );
    assert.deepEqual(
      readdirSync(path.join(inputs.repository, "build/runtime")),
      [],
    );
  });
});

test("offline temporary cleanup preserves the primary failure at each existing owner", async (context) => {
  const owners = [
    ["build", "ddwg-bundle-build-", (inputs) => assembleBundle(inputs)],
    [
      "verify",
      "ddwg-bundle-check-",
      (inputs, built) =>
        verifyBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
        }),
    ],
    [
      "install",
      "ddwg-bundle-install-",
      (inputs, built, primary) =>
        installBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
          commandRunner: () => {
            throw primary;
          },
        }),
    ],
    ["prime", "ddwg-bundle-prime-", (inputs) => buildReleaseBundle(inputs)],
    [
      "acquire",
      ".acquire-",
      (inputs, _built, primary) =>
        acquireGitHubBundle({
          repository: inputs.repository,
          environment: {
            GITHUB_REPOSITORY: "Example/Repository",
            DDWG_RELEASE_TAG: "v4.2.0",
          },
          fetcher: async () => {
            throw primary;
          },
        }),
    ],
  ];
  for (const [owner, prefix, operation] of owners) {
    await buildFixture(async (inputs) => {
      const built = assembleBundle(inputs);
      writeFileSync(
        path.join(inputs.repository, ".config/release/offline-bundle.json"),
        JSON.stringify(built),
      );
      if (owner === "build") unlinkSync(inputs.outputPath);
      if (owner === "prime")
        writeFileSync(
          path.join(inputs.repository, "package-lock.json"),
          JSON.stringify({
            lockfileVersion: 3,
            packages: {
              "": {},
              "node_modules/fixture": {
                resolved:
                  "https://registry.npmjs.org/fixture/-/fixture-1.0.0.tgz",
                integrity: "sha512-Zml4dHVyZQ==",
              },
            },
          }),
        );
      const primary = new Error(`${owner} primary fixture failure`);
      const cleanup = new Error(`${owner} temporary cleanup fixture failure`);
      const originalSpawn = childProcess.spawnSync;
      const originalRm = fs.rmSync;
      const originalTemp = fs.mkdtempSync;
      const originalDisposable = fs.mkdtempDisposableSync;
      const owned = [];
      const mocks = [
        context.mock.method(fs, "mkdtempSync", (input, options) => {
          const value = originalTemp(input, options);
          if (path.basename(String(input)).startsWith(prefix))
            owned.push(value);
          return value;
        }),
        context.mock.method(fs, "rmSync", (target, options) => {
          if (owned.includes(String(target))) throw cleanup;
          return originalRm(target, options);
        }),
        context.mock.method(fs, "mkdtempDisposableSync", (input, options) => {
          const resource = originalDisposable(input, options);
          if (!path.basename(String(input)).startsWith(prefix)) return resource;
          owned.push(resource.path);
          return {
            path: resource.path,
            remove: resource.remove,
            [Symbol.dispose]() {
              resource[Symbol.dispose]();
              throw cleanup;
            },
          };
        }),
        context.mock.method(
          childProcess,
          "spawnSync",
          (command, args, options) => {
            if (
              (command === "tar" &&
                args.some((arg) => ["-czf", "-xf"].includes(arg))) ||
              command === process.execPath
            )
              return { error: primary, status: null, stdout: "", stderr: "" };
            return originalSpawn(command, args, options);
          },
        ),
      ];
      syncBuiltinESMExports();
      try {
        await assert.rejects(
          async () => operation(inputs, built, primary),
          (error) => {
            assert.ok(
              error instanceof SuppressedError,
              `${owner}: ${error.message}`,
            );
            assert.equal(error.error, cleanup);
            assert.ok(
              error.suppressed === primary ||
                error.suppressed.cause === primary,
              `${owner}: missing original failure`,
            );
            return true;
          },
        );
      } finally {
        for (const mocked of mocks) mocked.mock.restore();
        syncBuiltinESMExports();
        for (const target of owned)
          originalRm(target, { recursive: true, force: true });
      }
    });
  }
});
