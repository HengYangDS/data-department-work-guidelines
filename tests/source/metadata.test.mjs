import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempDisposableSync, symlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { root } from "../../tools/runtime.mjs";

test("tracked text refuses invalid UTF-8 and NUL while declared binary assets remain reachable", () => {
  using directory = mkdtempDisposableSync(path.join(os.tmpdir(), "ddwg-source-bytes-"));
  cpSync(path.join(root, "tools"), path.join(directory.path, "tools"), {
    recursive: true,
  });
  symlinkSync(
    path.join(root, "node_modules"),
    path.join(directory.path, "node_modules"),
    "junction",
  );
  const initialized = spawnSync("git", ["init", "--quiet", directory.path], {
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.ifError(initialized.error);
  assert.equal(initialized.status, 0, initialized.stderr);
  writeFileSync(path.join(directory.path, ".gitignore"), "node_modules/\n");
  writeFileSync(
    path.join(directory.path, ".gitattributes"),
    "* text=auto eol=lf\nasset.bin -text\n",
  );
  writeFileSync(path.join(directory.path, "asset.bin"), Buffer.from([0, 255]));
  const module = pathToFileURL(path.join(directory.path, "tools/docs/content.mjs")).href;
  const command = [
    "--input-type=module",
    "--eval",
    `const { checkSourceBytes } = await import(${JSON.stringify(module)}); await checkSourceBytes();`,
  ];
  for (const [bytes, message] of [
    [Buffer.from([0xc3, 0x28]), /README\.md:.*UTF-8/u],
    [Buffer.from("Readable\0hidden\n"), /README\.md:.*NUL/u],
  ]) {
    writeFileSync(path.join(directory.path, "README.md"), bytes);
    const result = spawnSync(process.execPath, command, {
      cwd: directory.path,
      encoding: "utf8",
      timeout: 15_000,
    });
    assert.ifError(result.error);
    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, message);
  }
  writeFileSync(
    path.join(directory.path, "README.md"),
    "# Valid source\n\nQuoted original: \u201c\u4fe1\u3001\u8fbe\u3001\u96c5\u201d.\n\nLiteral: `\u{20000}`.\n",
  );
  const valid = spawnSync(process.execPath, command, {
    cwd: directory.path,
    encoding: "utf8",
    timeout: 15_000,
  });
  assert.ifError(valid.error);
  assert.equal(valid.status, 0, valid.stderr);
  writeFileSync(
    path.join(directory.path, ".gitattributes"),
    "* text=auto eol=lf\nasset.bin -text\nREADME.md -text\n",
  );
  const hidden = spawnSync(process.execPath, command, {
    cwd: directory.path,
    encoding: "utf8",
    timeout: 15_000,
  });
  assert.ifError(hidden.error);
  assert.notEqual(hidden.status, 0);
  assert.match(hidden.stderr, /README\.md:.*native text owner cannot be declared binary/u);
});
