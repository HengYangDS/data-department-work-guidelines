import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import {
  install,
  manifest,
  selectedAsset,
} from "../../tools/ci/install-native.mjs";
import {
  managedFileExists,
  nativeToolBinary,
  root,
} from "../../tools/docs/runtime.mjs";

test("managed cached binaries verify bytes before version execution", async () => {
  const directory = fs.realpathSync.native(
    fs.mkdtempSync(path.join(os.tmpdir(), "ddwg-native-integrity-")),
  );
  try {
    const runtime = path.join(directory, "tools/docs/runtime.mjs");
    const installer = path.join(directory, "tools/ci/install-native.mjs");
    for (const relative of [
      "tools/docs/runtime.mjs",
      "tools/ci/install-native.mjs",
      "tools/ci/gitlab-package.mjs",
    ]) {
      const destination = path.join(directory, relative);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(path.join(root, relative), destination);
    }
    const descriptor = manifest.tools.vale;
    const key = selectedAsset("vale").key;
    const target = path.join(
      directory,
      "build/runtime/tool-cache/vale",
      descriptor.version,
      key,
      descriptor.binary + (process.platform === "win32" ? ".exe" : ""),
    );
    const fixture = JSON.parse(JSON.stringify(manifest));
    const trusted = Buffer.from("trusted native fixture bytes");
    fixture.tools.vale.assets[key].binarySha256 = createHash("sha256")
      .update(trusted)
      .digest("hex");
    const supply = path.join(directory, ".config/supply/native.json");
    fs.mkdirSync(path.dirname(supply), { recursive: true });
    fs.writeFileSync(supply, JSON.stringify(fixture));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, "changed binary with the same reported version");
    if (process.platform !== "win32") fs.chmodSync(target, 0o755);
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import assert from "node:assert/strict";
        import fs from "node:fs";
        import childProcess from "node:child_process";
        import { pathToFileURL } from "node:url";
        import { syncBuiltinESMExports } from "node:module";
        const target = process.env.DDWG_FIXTURE_TARGET;
        const commandName = process.env.DDWG_FIXTURE_COMMAND;
        const expectedVersion = process.env.DDWG_FIXTURE_VERSION;
        let executions = 0;
        childProcess.spawnSync = (command, args) => {
          assert.ok(command === target || command === commandName || command === target + ".unbound");
          assert.deepEqual(args, ["--version"]);
          executions += 1;
          return { status: 0, stdout: expectedVersion, stderr: "" };
        };
        syncBuiltinESMExports();
        const runtime = await import(pathToFileURL(process.env.DDWG_FIXTURE_RUNTIME));
        const installer = await import(pathToFileURL(process.env.DDWG_FIXTURE_INSTALLER));
        assert.throws(() => runtime.nativeToolBinary("vale"), /binary digest mismatch/);
        await assert.rejects(installer.install({ tool: "vale" }), /binary digest mismatch/);
        process.env.DDWG_VALE_BIN = target;
        assert.throws(() => runtime.nativeToolBinary("vale"), /binary digest mismatch/);
        process.env.DDWG_VALE_BIN = commandName;
        process.env.PATH = process.env.DDWG_FIXTURE_PATH;
        assert.throws(() => runtime.nativeToolBinary("vale"), /binary digest mismatch/);
        const misplaced = target + ".unbound";
        fs.writeFileSync(misplaced, "unbound managed bytes");
        if (process.platform !== "win32") fs.chmodSync(misplaced, 0o755);
        process.env.DDWG_VALE_BIN = misplaced;
        assert.throws(() => runtime.nativeToolBinary("vale"), /managed.*identity/);
        delete process.env.DDWG_VALE_BIN;
        assert.equal(executions, 0, "changed cache must not execute");
        fs.writeFileSync(target, "trusted native fixture bytes");
        assert.equal(runtime.nativeToolBinary("vale"), target);
        assert.equal(await installer.install({ tool: "vale" }), target);
        assert.equal(executions, 2, "valid cache still checks its native version");
        process.env.DDWG_VALE_BIN = commandName;
        assert.equal(runtime.nativeToolBinary("vale"), target);
        delete process.env.DDWG_VALE_BIN;
        assert.equal(executions, 3, "PATH selection binds the same valid executable");
        const supply = process.env.DDWG_FIXTURE_SUPPLY;
        const manifest = JSON.parse(fs.readFileSync(supply, "utf8"));
        delete manifest.tools.vale.assets[process.env.DDWG_FIXTURE_KEY].binarySha256;
        fs.writeFileSync(supply, JSON.stringify(manifest));
        assert.throws(() => runtime.nativeToolBinary("vale"), /unpinned.*binary/);
        delete installer.manifest.tools.vale.assets[process.env.DDWG_FIXTURE_KEY].binarySha256;
        await assert.rejects(installer.install({ tool: "vale" }), /unpinned.*binary/);
        assert.equal(executions, 3, "missing byte identity must not execute");`,
      ],
      {
        cwd: directory,
        encoding: "utf8",
        timeout: 10_000,
        env: {
          ...process.env,
          DDWG_VALE_BIN: "",
          DDWG_FIXTURE_TARGET: target,
          DDWG_FIXTURE_COMMAND: path.basename(target),
          DDWG_FIXTURE_PATH: path.dirname(target),
          DDWG_FIXTURE_VERSION: descriptor.versionOutput,
          DDWG_FIXTURE_RUNTIME: runtime,
          DDWG_FIXTURE_INSTALLER: installer,
          DDWG_FIXTURE_SUPPLY: supply,
          DDWG_FIXTURE_KEY: key,
        },
      },
    );
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
    assert.equal(fs.existsSync(directory), false);
  }
});

test("managed files stay inside their selected repository boundary", () => {
  const temporary = fs.mkdtempSync(
    path.join(os.tmpdir(), "ddwg-managed-file-"),
  );
  try {
    const repository = path.join(temporary, "repository");
    fs.mkdirSync(repository);
    const target = path.join(repository, "build/cache/tool.bin");
    assert.equal(managedFileExists(target, repository), false);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, "existing pinned bytes");
    assert.equal(managedFileExists(target, repository), true);
    if (process.platform === "win32")
      assert.equal(
        managedFileExists(target.toUpperCase(), repository.toLowerCase()),
        true,
      );
    for (const outside of [
      repository,
      path.join(temporary, "repository-other/tool.bin"),
      path.join(repository, "../foreign.bin"),
    ])
      assert.throws(
        () => managedFileExists(outside, repository),
        /inside the repository/u,
      );
    assert.throws(
      () => managedFileExists(path.dirname(target), repository),
      /regular/u,
    );
    assert.throws(
      () => managedFileExists(path.join(target, "child.bin"), repository),
      /directory/u,
    );
    assert.equal(fs.readFileSync(target, "utf8"), "existing pinned bytes");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("managed native caches reject links and non-regular entries before execution", async (context) => {
  const originalSelection = process.env.DDWG_VALE_BIN;
  delete process.env.DDWG_VALE_BIN;
  context.after(() => {
    if (originalSelection === undefined) delete process.env.DDWG_VALE_BIN;
    else process.env.DDWG_VALE_BIN = originalSelection;
  });
  const selected = selectedAsset("vale");
  const target = path.join(
    root,
    "build/runtime/tool-cache/vale",
    selected.version,
    selected.key,
    selected.binaryName,
  );
  const actualExists = fs.existsSync;
  const actualStat = fs.lstatSync;
  const actualSpawn = childProcess.spawnSync;
  let executions = 0;
  for (const [exists, symbolicLink] of [
    [true, true],
    [false, true],
    [true, false],
  ]) {
    const mocks = [
      context.mock.method(fs, "existsSync", (file) =>
        file === target ? exists : actualExists(file),
      ),
      context.mock.method(fs, "lstatSync", (file, options) =>
        file === target
          ? { isFile: () => false, isSymbolicLink: () => symbolicLink }
          : actualStat(file, options),
      ),
      context.mock.method(
        childProcess,
        "spawnSync",
        (command, args, options) => {
          if (command !== target) return actualSpawn(command, args, options);
          executions += 1;
          return { status: 0, stdout: selected.versionOutput, stderr: "" };
        },
      ),
    ];
    syncBuiltinESMExports();
    try {
      await assert.rejects(install({ tool: "vale" }), /regular|symbolic/u);
      assert.throws(() => nativeToolBinary("vale"), /regular|symbolic/u);
      assert.equal(executions, 0);
    } finally {
      for (const mock of mocks) mock.mock.restore();
      syncBuiltinESMExports();
    }
  }
});

test("managed cache parent aliases fail before staging or execution", async (context) => {
  const originalSelection = process.env.DDWG_VALE_BIN;
  delete process.env.DDWG_VALE_BIN;
  context.after(() => {
    if (originalSelection === undefined) delete process.env.DDWG_VALE_BIN;
    else process.env.DDWG_VALE_BIN = originalSelection;
  });
  const selected = selectedAsset("vale");
  const directory = path.join(
    root,
    "build/runtime/tool-cache/vale",
    selected.version,
    selected.key,
  );
  const actualStat = fs.lstatSync;
  let executions = 0;
  const mocks = [
    context.mock.method(fs, "lstatSync", (file, options) =>
      file === directory
        ? {
            isDirectory: () => true,
            isFile: () => false,
            isSymbolicLink: () => true,
          }
        : actualStat(file, options),
    ),
    context.mock.method(childProcess, "spawnSync", () => {
      executions += 1;
      return { status: 0, stdout: selected.versionOutput, stderr: "" };
    }),
  ];
  syncBuiltinESMExports();
  try {
    await assert.rejects(
      install({ tool: "vale" }),
      /regular|symbolic|directory/u,
    );
    await assert.rejects(
      install({ tool: "vale", assetFile: "absent-asset" }),
      /regular|symbolic|directory/u,
    );
    assert.throws(
      () => nativeToolBinary("vale"),
      /regular|symbolic|directory/u,
    );
    assert.equal(executions, 0);
  } finally {
    for (const mock of mocks) mock.mock.restore();
    syncBuiltinESMExports();
  }
});

test("a supplied install never changes the mode of an existing cache entry", async (context) => {
  const selected = selectedAsset("vale");
  const target = path.join(
    root,
    "build/runtime/tool-cache/vale",
    selected.version,
    selected.key,
    selected.binaryName,
  );
  const asset = path.resolve("fixture-native-asset");
  const bytes = Buffer.from("fixture-pinned-asset");
  const descriptor = manifest.tools.vale.assets[selected.key];
  const originalDigest = descriptor.sha256;
  const originalBinaryDigest = descriptor.binarySha256;
  const actualRead = fs.readFileSync;
  const actualEntries = fs.readdirSync;
  const actualStat = fs.lstatSync;
  const actualSpawn = childProcess.spawnSync;
  const modes = [];
  const executions = [];
  let concurrentTarget = false;
  let extractionCount = 0;
  const mocks = [
    context.mock.method(fs, "readFileSync", (file, options) =>
      file === asset ||
      (file === target && concurrentTarget) ||
      path.basename(path.dirname(file)) === "extracted"
        ? bytes
        : actualRead(file, options),
    ),
    context.mock.method(fs, "readdirSync", (directory, options) =>
      path.basename(directory) === "extracted"
        ? [
            {
              name: selected.binaryName,
              isDirectory: () => false,
              isFile: () => true,
            },
          ]
        : actualEntries(directory, options),
    ),
    context.mock.method(fs, "lstatSync", (file, options) => {
      if (file === target) {
        return concurrentTarget
          ? { isFile: () => true, isSymbolicLink: () => false }
          : undefined;
      }
      return path.basename(path.dirname(file)) === "extracted"
        ? { isFile: () => true, isSymbolicLink: () => false }
        : actualStat(file, options);
    }),
    context.mock.method(fs, "chmodSync", (file) => modes.push(file)),
    context.mock.method(fs, "copyFileSync", () => {
      throw new Error("native tool publication must not expose a partial copy");
    }),
    context.mock.method(fs, "linkSync", (source, destination) => {
      assert.deepEqual(fs.readFileSync(source), bytes);
      assert.equal(destination, target);
      assert.equal(concurrentTarget, false);
      concurrentTarget = true;
      throw Object.assign(new Error("another install completed"), {
        code: "EEXIST",
      });
    }),
    context.mock.method(childProcess, "spawnSync", (command, args, options) => {
      if (command === "tar") {
        if (args.includes("-xf")) {
          extractionCount += 1;
          assert.ok(args.includes("--no-same-owner"));
        }
        const stdout =
          args[0] === "-tf"
            ? `${selected.binaryName}\n`
            : args[0] === "-tvf"
              ? `-rwxr-xr-x 0/0 10 ${selected.binaryName}\n`
              : "";
        return { status: 0, stdout, stderr: "" };
      }
      if (
        command === target ||
        path.basename(path.dirname(command)) === "extracted"
      ) {
        executions.push(command);
        return { status: 0, stdout: selected.versionOutput, stderr: "" };
      }
      return actualSpawn(command, args, options);
    }),
  ];
  descriptor.sha256 = createHash("sha256").update(bytes).digest("hex");
  descriptor.binarySha256 = descriptor.sha256;
  syncBuiltinESMExports();
  try {
    assert.equal(await install({ tool: "vale", assetFile: asset }), target);
    assert.equal(concurrentTarget, true);
    assert.equal(extractionCount, 1);
    assert.equal(modes.includes(target), false);
    assert.equal(executions.length, 2);
    assert.equal(executions[1], target);
  } finally {
    descriptor.sha256 = originalDigest;
    descriptor.binarySha256 = originalBinaryDigest;
    for (const mock of mocks) mock.mock.restore();
    syncBuiltinESMExports();
  }
});
