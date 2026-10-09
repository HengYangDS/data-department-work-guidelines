import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempDisposableSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { checkLinks, repositoryFileUri } from "../../tools/docs/content.mjs";
import { gitFiles, nativeToolBinary, root } from "../../tools/docs/runtime.mjs";
import { assertFixtureSources } from "../source/fixtures.mjs";

test("repository file links cannot escape the checkout", () => {
  const outside = pathToFileURL(path.resolve(root, "..", "outside.md")).href;
  assert.throws(() => repositoryFileUri(outside), /escapes repository root/u);
  const inside = pathToFileURL(path.join(root, "README.md")).href;
  assert.doesNotThrow(() => repositoryFileUri(inside));
  const directory = pathToFileURL(path.join(root, "docs")).href;
  assert.doesNotThrow(() => repositoryFileUri(directory));
});

test("an ignored local file cannot satisfy a repository source link", () => {
  mkdirSync(path.join(root, "build"), { recursive: true });
  const directory = mkdtempSync(path.join(root, "build", "ddwg-source-link-"));
  try {
    const target = path.join(directory, "local evidence.md");
    writeFileSync(target, "# Local Evidence\n\nThis file is not source.\n");
    const relative = path.relative(root, target).split(path.sep).join("/");
    assert.equal(gitFiles().includes(relative), false);
    assert.throws(
      () => repositoryFileUri(pathToFileURL(target).href),
      /not repository source/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("a delivered directory alias must also resolve to repository source", () => {
  mkdirSync(path.join(root, "build"), { recursive: true });
  const directory = mkdtempSync(path.join(root, "build", "ddwg-source-alias-"));
  try {
    const delivered = path.join(directory, "delivered");
    symlinkSync(path.join(root, "docs"), delivered, "junction");
    const relativeAlias = path
      .relative(root, delivered)
      .split(path.sep)
      .join("/");
    const sources = [...gitFiles(), relativeAlias];
    assert.doesNotThrow(() =>
      repositoryFileUri(pathToFileURL(delivered).href, sources),
    );
    assert.throws(
      () => repositoryFileUri(pathToFileURL(delivered).href),
      /not repository source/u,
    );

    const local = path.join(directory, "local");
    mkdirSync(local);
    writeFileSync(path.join(local, "README.md"), "# Local State\n");
    const localAlias = path.join(directory, "local-alias");
    symlinkSync(local, localAlias, "junction");
    const candidate = path.relative(root, localAlias).split(path.sep).join("/");
    assert.throws(
      () =>
        repositoryFileUri(pathToFileURL(localAlias).href, [
          ...sources,
          candidate,
        ]),
      /not repository source/u,
    );
    const outsideAlias = path.join(directory, "outside-alias");
    symlinkSync(path.dirname(root), outsideAlias, "junction");
    const outsideCandidate = path
      .relative(root, outsideAlias)
      .split(path.sep)
      .join("/");
    assert.throws(
      () =>
        repositoryFileUri(pathToFileURL(outsideAlias).href, [
          ...sources,
          outsideCandidate,
        ]),
      /escapes repository root/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("pinned lychee rejects a broken local fragment", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-links-test-"));
  try {
    writeFileSync(path.join(directory, "target.md"), "# Present\n");
    writeFileSync(
      path.join(directory, "source.md"),
      "[Missing](target.md#absent)\n",
    );
    const result = spawnSync(
      nativeToolBinary("lychee"),
      [
        "--offline",
        "--include-fragments=anchor-only",
        "--no-progress",
        "--max-retries",
        "0",
        path.join(directory, "source.md"),
      ],
      {
        encoding: "utf8",
        timeout: 15_000,
      },
    );
    assert.notEqual(result.status, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("live link checking is explicit and retains one native policy owner", async () => {
  const content = await import("../../tools/docs/content.mjs");
  assert.equal(typeof content.linkCheckArguments, "function");
  const offline = content.linkCheckArguments("files.txt");
  const online = content.linkCheckArguments("files.txt", { online: true });
  assert.equal(offline[0], "--config");
  assert.equal(offline[1], path.join(root, ".config/checks/links/lychee.toml"));
  assert.ok(!offline.some((arg) => arg.startsWith("--offline")));
  assert.ok(online.includes("--offline=false"));
  assert.deepEqual(
    online.filter((arg) => arg !== "--offline=false"),
    offline,
  );
  assert.ok(!online.includes("--accept"));
  assert.equal(online.at(-1), "files.txt");
});

test("native link extraction refuses warnings before checking targets", (context) => {
  const actualSpawn = childProcess.spawnSync;
  const output = context.mock.method(process.stdout, "write", () => true);
  let extractions = 0;
  let checks = 0;
  let sourceList;
  let nativeOutput;
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      const result = actualSpawn(command, args, options);
      if (args.includes("--dump")) {
        extractions += 1;
        sourceList = args[args.indexOf("--files-from") + 1];
        nativeOutput = result.stdout;
        return {
          ...result,
          stderr: `${result.stderr ?? ""}native link extraction warning\n`,
        };
      }
      if (args.includes("--files-from")) checks += 1;
      return result;
    },
  );
  syncBuiltinESMExports();
  try {
    assert.throws(
      () => checkLinks(),
      /emitted warning output:[\s\S]*native link extraction warning/u,
    );
    assert.equal(extractions, 1);
    assert.equal(checks, 0);
    assert.equal(output.mock.callCount(), 1);
    assert.equal(output.mock.calls[0].arguments[0], nativeOutput);
    assert.equal(existsSync(path.dirname(sourceList)), false);
  } finally {
    mock.mock.restore();
    output.mock.restore();
    syncBuiltinESMExports();
  }
});

test("native link policy rejects broken local anchors and makes no network request", async () => {
  const { createServer } = await import("node:http");
  const { linkCheckArguments } = await import("../../tools/docs/content.mjs");
  let requests = 0;
  const server = createServer((_request, response) => {
    requests += 1;
    response.writeHead(500).end();
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-native-links-"));
  try {
    const target = path.join(directory, "target.md");
    const source = path.join(directory, "source.md");
    const list = path.join(directory, "files.txt");
    writeFileSync(target, "# Report\n");
    writeFileSync(list, `${source}\n`);
    const runLinks = (fragment) => {
      writeFileSync(
        source,
        `# Links\n\n[Report](target.md#${fragment})\n\n[Remote](http://127.0.0.1:${server.address().port}/)\n`,
      );
      return spawnSync(nativeToolBinary("lychee"), linkCheckArguments(list), {
        cwd: root,
        encoding: "utf8",
        timeout: 10_000,
      });
    };
    const valid = runLinks("report");
    assert.ifError(valid.error);
    assert.equal(valid.status, 0, valid.stderr);
    const broken = runLinks("missing");
    assert.ifError(broken.error);
    assert.notEqual(broken.status, 0);
    assert.match(`${broken.stdout}${broken.stderr}`, /missing|fragment/iu);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(requests, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
    await new Promise((resolve) => server.close(resolve));
  }
});

test("native online link policy actually requests the target and rejects HTTP failures", async () => {
  const { createServer } = await import("node:http");
  const { linkCheckArguments } = await import("../../tools/docs/content.mjs");
  let requests = 0;
  let status = 200;
  const server = createServer((_request, response) => {
    requests += 1;
    response.writeHead(status).end("link fixture");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    using directory = mkdtempDisposableSync(
      path.join(os.tmpdir(), "ddwg-online-links-"),
    );
    const source = path.join(directory.path, "source.md");
    const list = path.join(directory.path, "files.txt");
    writeFileSync(
      source,
      `# Links\n\n[Remote](http://127.0.0.1:${server.address().port}/)\n`,
    );
    writeFileSync(list, `${source}\n`);
    const check = async () => {
      const child = childProcess.spawn(
        nativeToolBinary("lychee"),
        linkCheckArguments(list, { online: true }),
        {
          cwd: root,
          stdio: ["ignore", "pipe", "pipe"],
          timeout: 10_000,
        },
      );
      let output = "";
      child.stdout.on("data", (bytes) => {
        output += bytes;
      });
      child.stderr.on("data", (bytes) => {
        output += bytes;
      });
      const code = await new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("close", resolve);
      });
      return { code, output };
    };
    const valid = await check();
    assert.equal(valid.code, 0, valid.output);
    assert.ok(requests > 0, "online mode made an actual HTTP request");
    const beforeFailure = requests;
    status = 404;
    const invalid = await check();
    assert.notEqual(invalid.code, 0, invalid.output);
    assert.ok(
      requests > beforeFailure,
      "the failed request reached the target",
    );
    assert.match(invalid.output, /404/u);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("link checking rejects an incomplete-mode waiver", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/docs/cli.mjs", "links", "--allow-incomplete"],
    { cwd: root, encoding: "utf8", timeout: 10_000 },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /links accepts only --online/u);
});

test("the public link check rejects cache and Git state but accepts candidate source", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-source-links-"));
  try {
    const initialized = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.ifError(initialized.error);
    assert.equal(initialized.status, 0, initialized.stderr);
    for (const prerequisite of ["tools", ".config", "package.json"]) {
      cpSync(
        path.join(root, prerequisite),
        path.join(directory, prerequisite),
        {
          recursive: true,
        },
      );
    }
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(directory, "node_modules"),
      "junction",
    );
    const entry = path.join(directory, "README.md");
    const original = "# Source Links\n";
    writeFileSync(entry, original);
    mkdirSync(path.join(directory, "docs"));
    writeFileSync(
      path.join(directory, "docs", "README.md"),
      "# Guide\n\nRead the [source entry](../README.md).\n",
    );
    writeFileSync(
      path.join(directory, ".gitignore"),
      "node_modules/\n/node_modules\n/tools/\n/.config/\n/package.json\nbuild/\n.cache/\n",
    );
    const added = spawnSync(
      "git",
      ["add", "--", ".gitignore", "README.md", "docs/README.md"],
      { cwd: directory, encoding: "utf8", timeout: 10_000 },
    );
    assert.ifError(added.error);
    assert.equal(added.status, 0, added.stderr);
    assertFixtureSources(directory, [
      ".gitignore",
      "README.md",
      "docs/README.md",
    ]);
    const check = (target) => {
      const source = `${original}\n[Source reference](${target})\n`;
      writeFileSync(entry, source);
      const result = spawnSync(
        process.execPath,
        ["tools/docs/cli.mjs", "links"],
        {
          cwd: directory,
          encoding: "utf8",
          timeout: 15_000,
          env: { ...process.env, DDWG_LYCHEE_BIN: nativeToolBinary("lychee") },
        },
      );
      assert.equal(readFileSync(entry, "utf8"), source);
      return result;
    };
    const tracked = check("docs/README.md");
    assert.ifError(tracked.error);
    assert.equal(tracked.status, 0, tracked.stderr);
    const candidate = "docs/source link candidate.md";
    writeFileSync(path.join(directory, candidate), "# Candidate Source\n");
    const valid = check(encodeURI(candidate));
    assert.ifError(valid.error);
    assert.equal(valid.status, 0, valid.stderr);

    for (const target of [
      "build/local-only.md",
      ".cache/local-only.md",
      ".git/local-only.md",
    ]) {
      const file = path.join(directory, target);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, "# Local State\n");
      const invalid = check(target);
      assert.ifError(invalid.error);
      assert.notEqual(invalid.status, 0, `${target}: ${invalid.stdout}`);
      assert.match(invalid.stderr, /not repository source/u, target);
    }
    assertFixtureSources(directory, [
      ".gitignore",
      "README.md",
      "docs/README.md",
      candidate,
    ]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});
