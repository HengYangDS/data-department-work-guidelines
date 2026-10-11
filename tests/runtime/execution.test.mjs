import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { root, run } from "../../tools/runtime.mjs";

test("native process input reaches its selected child without a shell", () => {
  const input = "First reference\0Second reference\0";
  const output = run(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      "const chunks = []; for await (const chunk of process.stdin) chunks.push(chunk); process.stdout.write(Buffer.concat(chunks));",
    ],
    { capture: true, input, timeout: 10_000 },
  );
  assert.equal(output, input);
});

test("the public check command rejects incomplete-mode waivers", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/docs/cli.mjs", "check", "--allow-incomplete"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
    },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /check accepts no arguments/u);
});

test("source checking does not require a frozen release artifact", () => {
  const artifact = pathToFileURL(
    path.join(root, "tools/ci/offline/artifact.mjs"),
  ).href;
  const entry = pathToFileURL(path.join(root, "tools/docs/cli.mjs")).href;
  const script = `
    import { registerHooks } from "node:module";
    registerHooks({
      resolve(specifier, context, nextResolve) {
        const resolved = nextResolve(specifier, context);
        if (resolved.url === ${JSON.stringify(artifact)})
          throw new Error("source check requested a frozen release artifact");
        return resolved;
      },
    });
    process.argv = [process.execPath, ${JSON.stringify(path.join(root, "tools/docs/cli.mjs"))}, "check"];
    await import(${JSON.stringify(entry)});
  `;
  const result = spawnSync(process.execPath, ["--input-type=module"], {
    cwd: root,
    encoding: "utf8",
    input: script,
    timeout: 30_000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PASS repository source checks/u);
});
