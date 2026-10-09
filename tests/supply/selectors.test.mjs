import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { manifest } from "../../tools/ci/install-native.mjs";
import { nativeToolBinary, root } from "../../tools/docs/runtime.mjs";

test("explicit native tool selectors use portable names and retain version admission", (context) => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "ddwg-native-selector-"),
  );
  const actual = childProcess.spawnSync;
  const saved = new Map();
  let expected;
  let version;
  let executions = 0;
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (command !== expected) return actual(command, args, options);
      assert.deepEqual(args, ["--version"]);
      assert.equal(options.timeout, 10_000);
      executions++;
      return { status: 0, stdout: version, stderr: "" };
    },
  );
  syncBuiltinESMExports();
  try {
    for (const [tool, descriptor] of Object.entries(manifest.tools)) {
      const key = `DDWG_${tool.toUpperCase().replaceAll("-", "_")}_BIN`;
      saved.set(key, process.env[key]);
      expected = path.join(
        directory,
        descriptor.binary + (process.platform === "win32" ? ".exe" : ""),
      );
      fs.writeFileSync(expected, "independently owned tool fixture");
      if (process.platform !== "win32") fs.chmodSync(expected, 0o755);
      process.env[key] = expected;
      version = descriptor.versionOutput;
      assert.equal(nativeToolBinary(tool), expected, tool);
      version = "unexpected version\n";
      assert.throws(() => nativeToolBinary(tool), /version mismatch/u);
    }
    assert.equal(executions, Object.keys(manifest.tools).length * 2);
  } finally {
    for (const [key, value] of saved) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    mock.mock.restore();
    syncBuiltinESMExports();
    fs.rmSync(directory, { recursive: true, force: true });
    assert.equal(fs.existsSync(directory), false);
  }
});

test("explicit native selectors preserve filesystem path semantics", (context) => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "ddwg-native-filesystem-selector-"),
  );
  const descriptor = manifest.tools.vale;
  const filename =
    descriptor.binary + (process.platform === "win32" ? ".exe" : "");
  const binary = path.join(directory, filename);
  const originalSelection = process.env.DDWG_VALE_BIN;
  let expected = binary;
  let executions = 0;
  const spawn = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args) => {
      assert.equal(command, expected);
      assert.deepEqual(args, ["--version"]);
      executions += 1;
      return { status: 0, stdout: descriptor.versionOutput, stderr: "" };
    },
  );
  syncBuiltinESMExports();
  try {
    fs.writeFileSync(binary, "independently owned executable fixture");
    if (process.platform !== "win32") fs.chmodSync(binary, 0o755);
    process.env.DDWG_VALE_BIN = binary + path.sep;
    assert.throws(() => nativeToolBinary("vale"), /not found/u);
    assert.equal(
      executions,
      0,
      "a directory-qualified file cannot be executed",
    );
    process.env.DDWG_VALE_BIN = binary;
    assert.equal(nativeToolBinary("vale"), binary);
    if (process.platform !== "win32") {
      const target = path.join(directory, "target");
      fs.mkdirSync(path.join(target, "nested"), { recursive: true });
      fs.writeFileSync(
        path.join(target, filename),
        "filesystem-resolved fixture",
      );
      fs.chmodSync(path.join(target, filename), 0o755);
      fs.symlinkSync(
        path.join(target, "nested"),
        path.join(directory, "alias"),
      );
      expected = directory + "/alias/../" + filename;
      assert.equal(
        fs.readFileSync(expected, "utf8"),
        "filesystem-resolved fixture",
      );
      process.env.DDWG_VALE_BIN = expected;
      assert.equal(nativeToolBinary("vale"), expected);
      assert.equal(
        executions,
        2,
        "the native path must not select the lexical sibling",
      );
    }
  } finally {
    if (originalSelection === undefined) delete process.env.DDWG_VALE_BIN;
    else process.env.DDWG_VALE_BIN = originalSelection;
    spawn.mock.restore();
    syncBuiltinESMExports();
    fs.rmSync(directory, { recursive: true, force: true });
    assert.equal(fs.existsSync(directory), false);
  }
});

test("Windows native selection binds quoted paths and direct suffixes before execution", async (context) => {
  const directory = fs.realpathSync.native(
    fs.mkdtempSync(path.join(os.tmpdir(), "ddwg-native-windows-lookup-")),
  );
  const runtimePath = path.join(directory, "tools/docs/runtime.mjs");
  const target = path.join(
    directory,
    "build/runtime/tool-cache/vale",
    manifest.tools.vale.version,
    "win32-x64/vale.exe",
  );
  const fixture = JSON.parse(JSON.stringify(manifest));
  const trusted = Buffer.from("trusted Windows native fixture bytes");
  fixture.tools.vale.assets["win32-x64"].binarySha256 = createHash("sha256")
    .update(trusted)
    .digest("hex");
  const originalPlatform = Object.getOwnPropertyDescriptor(process, "platform");
  const originalArch = Object.getOwnPropertyDescriptor(process, "arch");
  const originalPath = process.env.PATH;
  const originalSelection = process.env.DDWG_VALE_BIN;
  let executions = 0;
  let expected = target;
  const spawn = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args) => {
      assert.equal(command, expected);
      assert.deepEqual(args, ["--version"]);
      executions += 1;
      return {
        status: 0,
        stdout: fixture.tools.vale.versionOutput,
        stderr: "",
      };
    },
  );
  syncBuiltinESMExports();
  try {
    fs.mkdirSync(path.dirname(runtimePath), { recursive: true });
    fs.copyFileSync(path.join(root, "tools/docs/runtime.mjs"), runtimePath);
    const supply = path.join(directory, ".config/supply/native.json");
    fs.mkdirSync(path.dirname(supply), { recursive: true });
    fs.writeFileSync(supply, JSON.stringify(fixture));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(
      target,
      "altered native bytes with unchanged version output",
    );
    Object.defineProperty(process, "platform", {
      ...originalPlatform,
      value: "win32",
    });
    process.env.PATH = '"' + path.dirname(target) + '"';
    const runtime = await import(pathToFileURL(runtimePath));
    for (const architecture of ["x64", "arm64"]) {
      Object.defineProperty(process, "arch", {
        ...originalArch,
        value: architecture,
      });
      const before = executions;
      fs.writeFileSync(
        target,
        "altered native bytes with unchanged version output",
      );
      process.env.DDWG_VALE_BIN = "vale.exe";
      assert.throws(
        () => runtime.nativeToolBinary("vale"),
        /binary digest mismatch/u,
      );
      assert.equal(
        executions,
        before,
        "quoted managed PATH must not bypass byte admission",
      );
      fs.writeFileSync(target, trusted);
      assert.equal(runtime.nativeToolBinary("vale"), target);
      process.env.DDWG_VALE_BIN = target.slice(0, -4);
      assert.equal(runtime.nativeToolBinary("vale"), target);
    }
    assert.equal(
      executions,
      4,
      "x64 and ARM64 Node selectors start the same verified compatible file",
    );
    process.env.DDWG_VALE_BIN = "absent-native-file.exe";
    assert.throws(() => runtime.nativeToolBinary("vale"), /not found/u);
    assert.equal(
      executions,
      4,
      "unresolved selectors must not start an unbound command",
    );
    expected = path.join(directory, "..com");
    fs.writeFileSync(expected, "independently owned single-dot lookup fixture");
    process.env.DDWG_VALE_BIN = ".";
    assert.throws(() => runtime.nativeToolBinary("vale"), /not found/u);
    assert.equal(
      executions,
      4,
      "the native single-dot refusal must precede startup",
    );
  } finally {
    Object.defineProperty(process, "platform", originalPlatform);
    Object.defineProperty(process, "arch", originalArch);
    if (originalPath === undefined) delete process.env.PATH;
    else process.env.PATH = originalPath;
    if (originalSelection === undefined) delete process.env.DDWG_VALE_BIN;
    else process.env.DDWG_VALE_BIN = originalSelection;
    spawn.mock.restore();
    syncBuiltinESMExports();
    fs.rmSync(directory, { recursive: true, force: true });
    assert.equal(fs.existsSync(directory), false);
  }
});
