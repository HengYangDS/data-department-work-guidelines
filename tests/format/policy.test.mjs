import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempDisposableSync,
  mkdtempSync,
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
import { parse as parseToml } from "smol-toml";
import {
  formatSource,
  lintMarkdown,
  textViolations,
} from "../../tools/docs/content.mjs";
import { checkConfigurationLayout } from "../../tools/docs/governance.mjs";
import { nativeToolBinary, nodeTool, root } from "../../tools/docs/runtime.mjs";

test("native structured formats preserve literal blank lines", async () => {
  for (const [name, source] of [
    ["example.mjs", "export const literal = `first\n\n\nsecond`;\n"],
    ["example.yaml", "literal: |\n  first\n\n\n  second\n"],
    ["example.toml", 'literal = """\nfirst\n\n\nsecond\n"""\n'],
  ]) {
    assert.deepEqual(await textViolations(name, source), [], name);
    if (name.endsWith(".toml")) {
      assert.equal(parseToml(source).literal, "first\n\n\nsecond\n");
    }
  }
});

test("one formatting attempt uses one fresh native TOML formatter", async (context) => {
  const NativeModule = WebAssembly.Module;
  let constructions = 0;
  WebAssembly.Module = new Proxy(NativeModule, {
    construct(target, args) {
      constructions += 1;
      return Reflect.construct(target, args);
    },
  });
  const nativeSpawn = childProcess.spawnSync;
  const mocked = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (args?.[0] === nodeTool("prettier", "prettier"))
        return { status: 0, stdout: "", stderr: "" };
      return nativeSpawn(command, args, options);
    },
  );
  syncBuiltinESMExports();
  try {
    await formatSource();
    assert.equal(
      constructions,
      1,
      "matching and formatting share one native instance",
    );
  } finally {
    WebAssembly.Module = NativeModule;
    mocked.mock.restore();
    syncBuiltinESMExports();
  }
});

test("the text boundary retains TOML syntax without duplicating native formatting", async () => {
  const toml = ".config/checks/markdown/markdownlint.toml";
  assert.deepEqual(
    await textViolations(toml, "[MD013]\nline_length = 80\n"),
    [],
  );
  assert.match((await textViolations(toml, "[invalid\n"))[0], /invalid TOML/u);
});

test("native TOML policy preserves data and agrees with the source format owner", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-toml-policy-"));
  try {
    cpSync(path.join(root, ".config"), path.join(directory, ".config"), {
      recursive: true,
    });
    const policyPath = path.join(directory, ".config/checks/format/toml.toml");
    const original = readFileSync(policyPath, "utf8");
    assert.doesNotThrow(() => checkConfigurationLayout(directory));
    for (const [before, after] of [
      ["lineWidth = 80", "lineWidth = 120"],
      ["indentWidth = 2", "indentWidth = 4"],
      ['newLineKind = "lf"', 'newLineKind = "crlf"'],
      ['quoteStyle = "maintain"', 'quoteStyle = "preferDouble"'],
      ["sortKeys = false", "sortKeys = true"],
      ["sortArrays = false", "sortArrays = true"],
      ["sortInlineTables = false", "sortInlineTables = true"],
      [
        '"comment.forceLeadingSpace" = false',
        '"comment.forceLeadingSpace" = true',
      ],
      ['"cargo.applyConventions" = false', '"cargo.applyConventions" = true'],
    ]) {
      assert.ok(original.includes(before), before);
      writeFileSync(policyPath, original.replace(before, after));
      assert.throws(
        () => checkConfigurationLayout(directory),
        /native TOML.*policy/u,
        after,
      );
    }
    writeFileSync(policyPath, `${original}unknownNativeOption = true\n`);
    assert.throws(
      () => checkConfigurationLayout(directory),
      /unknownNativeOption/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("unowned code formats fail explicitly instead of accepting raw whitespace", async () => {
  for (const name of ["sample.py", "sample.rs", "sample.sh"]) {
    assert.match(
      (await textViolations(name, "first\n\n\nsecond\n"))[0],
      /no native formatting owner/u,
      name,
    );
  }
});

test("the generated Mise lock keeps its native TOML owner", async () => {
  const source = readFileSync(
    path.join(root, ".config/supply/mise.lock"),
    "utf8",
  );
  assert.deepEqual(
    await textViolations(".config/supply/mise.lock", source),
    [],
  );
  assert.match(
    (await textViolations(".config/supply/mise.lock", "not = ["))[0],
    /invalid TOML/u,
  );
  assert.match(
    (await textViolations("unowned.lock", source))[0],
    /no native formatting owner/u,
  );
});

test("Markdown checks consume the native concern-local TOML policy", () => {
  const relative = ".config/checks/markdown/markdownlint.toml";
  assert.ok(existsSync(path.join(root, relative)), relative);
  const source = "# Example\n\n<!-- vale off -->\n\nUse the report.\n";
  assert.throws(
    () => lintMarkdown({ files: [], strings: { "fixture.md": source } }),
    /no-quality-control/u,
  );
});

test("native formatter controls preserve byte-exact examples at their own parser", async () => {
  const { format } = await import("prettier");
  for (const separator of [" ", "\t", "\n"]) {
    const source = `<!-- prettier-ignore-attribute${separator}class -->\n<div class = 'example'>Read the source.</div>\n`;
    assert.equal(await format(source, { parser: "html" }), source);
    assert.deepEqual(
      await textViolations("fixture.html", source),
      [],
      `native HTML whitespace: ${JSON.stringify(separator)}`,
    );
  }
  assert.equal(
    await format("<div class = 'example'>Read the source.</div>\n", {
      parser: "html",
    }),
    '<div class="example">Read the source.</div>\n',
  );
  for (const [relative, source] of [
    ["fixture.mjs", "// prettier-ignore\nconst result={ready: true};\n"],
    ["fixture.ts", "/* prettier-ignore */\nconst result: boolean = true;\n"],
    ["fixture.yaml", "# prettier-ignore\nready:   true\n"],
    ["fixture.jsonc", '// prettier-ignore\n{"ready":   true}\n'],
    ["fixture.css", "/* prettier-ignore */\na{color: red;}\n"],
    [
      "fixture.html",
      "<!-- prettier-ignore-attribute class -->\n<div class='example'>Read the source.</div>\n",
    ],
    ["fixture.graphql", "# prettier-ignore\ntype Query { result: String }\n"],
    ["fixture.hbs", "{{! prettier-ignore }}\n<div>{{value}}</div>\n"],
  ]) {
    assert.deepEqual(await textViolations(relative, source), [], relative);
  }
  for (const [relative, source] of [
    ["fixture.mjs", 'const message = "// prettier-ignore";\n'],
    ["fixture.ts", 'const message: string = "/* prettier-ignore */";\n'],
    ["fixture.yaml", 'message: "# prettier-ignore"\n'],
    ["fixture.yaml", "message: |\n  # prettier-ignore\n"],
    ["fixture.jsonc", '{"message": "// prettier-ignore"}\n'],
    ["fixture.css", 'a::before { content: "/* prettier-ignore */"; }\n'],
    ["fixture.html", "<p>prettier-ignore</p>\n"],
    [
      "fixture.graphql",
      'type Query { result(message: String = "prettier-ignore"): String }\n',
    ],
    ["fixture.hbs", "<p>prettier-ignore</p>\n"],
    ["fixture.toml", "# dprint-ignore\nkey=   1\n"],
  ]) {
    assert.deepEqual(await textViolations(relative, source), [], relative);
  }
});

test("only declared plain-text identities bypass native parser ownership", async () => {
  for (const name of ["Makefile", "Dockerfile", "custom-build"]) {
    assert.match(
      (await textViolations(name, "Build the source.\n"))[0] ?? "",
      /no native formatting owner/u,
      name,
    );
  }
  for (const name of ["LICENSE", "VERSION", ".gitignore", ".gitattributes"]) {
    assert.deepEqual(await textViolations(name, "Plain text.\n"), [], name);
  }
});

test("parser ownership resolves the source path rather than the caller cwd", async () => {
  using directory = mkdtempDisposableSync(
    path.join(os.tmpdir(), "ddwg-parser-owner-"),
  );
  cpSync(path.join(root, "tools"), path.join(directory.path, "tools"), {
    recursive: true,
  });
  symlinkSync(
    path.join(root, "node_modules"),
    path.join(directory.path, "node_modules"),
    "junction",
  );
  const source =
    "#!/usr/bin/env node\nconst value = 1;\n\n\nconsole.log(value);\n";
  writeFileSync(path.join(directory.path, "cli"), source);
  const module = pathToFileURL(
    path.join(directory.path, "tools/docs/content.mjs"),
  ).href;
  const script = `
    import assert from "node:assert/strict";
    const { formatTargets, textViolations } = await import(${JSON.stringify(module)});
    assert.deepEqual((await formatTargets(["cli"], { fileExtensions: ["toml"], fileNames: [] })).prettier, ["cli"]);
    assert.deepEqual(await textViolations("cli", ${JSON.stringify(source)}), []);
  `;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", script],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 15_000,
    },
  );
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
});

test("native source tools treat selected filenames as literal inputs", async () => {
  using directory = mkdtempDisposableSync(
    path.join(os.tmpdir(), "ddwg-literal-tool-input-"),
  );
  writeFileSync(
    path.join(directory.path, ".gitignore"),
    "/tools/\n/.config/\n/node_modules/\n/package.json\n",
  );
  cpSync(path.join(root, "tools"), path.join(directory.path, "tools"), {
    recursive: true,
  });
  cpSync(path.join(root, ".config"), path.join(directory.path, ".config"), {
    recursive: true,
  });
  cpSync(
    path.join(root, "package.json"),
    path.join(directory.path, "package.json"),
  );
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
  const source = path.join(directory.path, "--write.md");
  writeFileSync(source, "# Native Source\n\n-  Item\n");
  const lychee = nativeToolBinary("lychee");
  const environment = {
    ...process.env,
    DDWG_LYCHEE_BIN: /[/\\]/u.test(lychee) ? path.resolve(lychee) : lychee,
  };
  const invoke = (command) =>
    spawnSync(process.execPath, ["tools/docs/cli.mjs", ...command], {
      cwd: directory.path,
      env: environment,
      encoding: "utf8",
      timeout: 30_000,
    });
  const unformatted = invoke(["format", "--check"]);
  assert.ifError(unformatted.error);
  assert.notEqual(unformatted.status, 0);
  assert.match(unformatted.stderr, /Code style issues/u);
  const formatted = invoke(["format"]);
  assert.ifError(formatted.error);
  assert.equal(formatted.status, 0, formatted.stderr);
  const rechecked = invoke(["format", "--check"]);
  assert.ifError(rechecked.error);
  assert.equal(rechecked.status, 0, rechecked.stderr);
  assert.equal(readFileSync(source, "utf8"), "# Native Source\n\n- Item\n");

  const { linkCheckArguments } = await import("../../tools/docs/content.mjs");
  const literalFiles = [
    process.platform === "win32" ? "--dump.md" : "with\nline.md",
    "with space.md",
  ].map((name) => path.join(directory.path, name));
  const target = path.join(directory.path, "target.md");
  const list = path.join(directory.path, "files.txt");
  writeFileSync(target, "# Target\n");
  writeFileSync(list, `${source}\n`);
  for (const file of literalFiles)
    writeFileSync(file, "# Links\n\n[Target](target.md#target)\n");
  const check = () =>
    spawnSync(
      environment.DDWG_LYCHEE_BIN,
      linkCheckArguments(list, { literalFiles }),
      {
        cwd: directory.path,
        encoding: "utf8",
        timeout: 15_000,
      },
    );
  const valid = check();
  assert.ifError(valid.error);
  assert.equal(valid.status, 0, valid.stderr);
  writeFileSync(literalFiles[0], "# Links\n\n[Missing](target.md#absent)\n");
  const broken = check();
  assert.ifError(broken.error);
  assert.notEqual(broken.status, 0);
  assert.match(`${broken.stdout}${broken.stderr}`, /absent|fragment/iu);
  const rejected = invoke(["links"]);
  assert.ifError(rejected.error);
  assert.notEqual(rejected.status, 0);
  assert.match(`${rejected.stdout}${rejected.stderr}`, /absent|fragment/iu);
  writeFileSync(literalFiles[0], "# Links\n\n[Target](target.md#target)\n");
  const corrected = invoke(["links"]);
  assert.ifError(corrected.error);
  assert.equal(corrected.status, 0, corrected.stderr);
});
