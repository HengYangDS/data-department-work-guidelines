import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { parse as parseToml } from "smol-toml";
import { lintMarkdown, textViolations } from "../../tools/docs/content.mjs";
import { root } from "../../tools/docs/runtime.mjs";

test("Markdown spacing preserves fenced and indented literal content", async () => {
  for (const source of [
    "# Example\n\n```text\nfirst\n\n\nsecond\n```\n",
    "# Example\n\n````text\n```\n\n\n```\n````\n",
    "# Example\n\n    first\n\n\n    second\n",
    "# Example\n\n> ```text\n> first\n>\n>\n> second\n> ```\n",
  ]) {
    assert.doesNotThrow(() =>
      lintMarkdown({ files: [], strings: { "fixture.md": source } }),
    );
    assert.deepEqual(await textViolations("fixture.md", source), []);
  }
});

test("native formatting rejects reader padding without changing literal content", async () => {
  const { check, format } = await import("prettier");
  const source = "# Example\n\n```text\nfirst\n\n\nsecond\n```\n\n\nOutside.\n";
  const options = { parser: "markdown" };
  assert.equal(await check(source, options), false);
  const formatted = await format(source, options);
  assert.equal(
    formatted,
    "# Example\n\n```text\nfirst\n\n\nsecond\n```\n\nOutside.\n",
  );
  assert.equal(await check(formatted, options), true);
  assert.deepEqual(await textViolations("fixture.md", source), []);
});

test("native formatting owns one structural separator and its fixed point", async () => {
  const { check, format } = await import("prettier");
  const options = { parser: "markdown" };
  const source = "\n# A\n\n\nText\n\n";
  assert.equal(await check(source, options), false);
  const formatted = await format(source, options);
  assert.equal(formatted, "# A\n\nText\n");
  assert.equal(await check(formatted, options), true);
  assert.equal(await format(formatted, options), formatted);
});

test("Markdown fences preserve tight lists at the native format fixed point", async () => {
  const { format } = await import("prettier");
  const config = parseToml(
    readFileSync(
      path.join(root, ".config/checks/format/prettier.toml"),
      "utf8",
    ),
  );
  for (const body of [
    "- First.\n  ```text\n  example\n  ```\n- Second.\n",
    "- [x] First.\n  ```text\n  example\n  ```\n- [ ] Second.\n",
    "- Parent.\n  - First.\n    ```text\n    example\n    ```\n  - Second.\n",
    "> - First.\n>   ```text\n>   example\n>   ```\n> - Second.\n",
  ]) {
    const source = `# Spacing\n\n${body}`;
    assert.equal(
      await format(source, { ...config, parser: "markdown" }),
      source,
    );
    assert.doesNotThrow(() =>
      lintMarkdown({ files: [], strings: { "spacing.md": source } }),
    );
  }
});

test("native formatting separates fences outside list containers", async () => {
  const { check, format } = await import("prettier");
  for (const body of [
    "Text.\n```text\nexample\n```\n",
    "```text\nexample\n```\nText.\n",
  ]) {
    const source = `# Spacing\n\n${body}`;
    assert.equal(await check(source, { parser: "markdown" }), false);
    const formatted = await format(source, { parser: "markdown" });
    assert.equal(await check(formatted, { parser: "markdown" }), true);
    assert.doesNotThrow(() =>
      lintMarkdown({ files: [], strings: { "spacing.md": formatted } }),
    );
  }
});

test("Markdown lint accepts native list containers without a second spacing verdict", async () => {
  const { format } = await import("prettier");
  for (const body of [
    "- First.\n\n- Second.\n",
    "- First with a wrapped\n  paragraph.\n\n- Second.\n",
    "1. First.\n\n2. Second.\n",
    "- [x] First.\n\n- [ ] Second.\n",
    "> - First.\n>\n> - Second.\n",
    "- Parent.\n  - First.\n\n  - Second.\n",
    "- First.\n\n  Separate paragraph.\n- Second.\n",
    "- First.\n  ```text\n  example\n  ```\n- Second.\n",
  ]) {
    const formatted = await format(`# Spacing\n\n${body}`, {
      parser: "markdown",
    });
    assert.equal(await format(formatted, { parser: "markdown" }), formatted);
    assert.doesNotThrow(
      () =>
        lintMarkdown({
          files: [],
          strings: { "spacing.md": formatted },
        }),
      body,
    );
  }
});

test("Markdown list spacing preserves meaningful block and literal boundaries", () => {
  for (const body of [
    "- First with a wrapped\n  paragraph.\n- Second.\n",
    "- First.\n\n  Separate paragraph.\n\n- Second.\n",
    "- First.\n\n  ```text\n  first\n\n\n  second\n  ```\n\n- Second.\n",
    "- Parent.\n  - First.\n  - Second.\n- Next parent.\n",
    "> - First.\n> - Second.\n",
    "- First.\n\n## Separate Work\n\n- Second.\n",
    "```markdown\n- First.\n\n- Second.\n```\n",
  ]) {
    assert.doesNotThrow(() =>
      lintMarkdown({
        files: [],
        strings: { "spacing.md": `# Spacing\n\n${body}` },
      }),
    );
  }
});

test("native formatting reconciles genuinely loose lists without a lint veto", async () => {
  const { format } = await import("prettier");
  const source = "# Spacing\n\n- First.\n\n  Separate paragraph.\n- Second.\n";
  const formatted = await format(source, { parser: "markdown" });
  assert.equal(
    formatted,
    "# Spacing\n\n- First.\n\n  Separate paragraph.\n\n- Second.\n",
  );
  assert.doesNotThrow(() =>
    lintMarkdown({ files: [], strings: { "spacing.md": formatted } }),
  );
});

test("native formatter controls can protect byte-exact Markdown examples", async () => {
  const { format } = await import("prettier");
  for (const source of [
    "<!-- prettier-ignore -->\n#  Spacing\n",
    "<!-- prettier-ignore -->\n#  Spacing  #\n",
    "# Spacing\n\n<!-- prettier-ignore -->\n\n| first |second|\n| --- | --- |\n| input |output|\n",
  ]) {
    const formatted = await format(source, { parser: "markdown" });
    assert.equal(await format(formatted, { parser: "markdown" }), formatted);
    assert.doesNotThrow(() =>
      lintMarkdown({ files: [], strings: { "exact.md": formatted } }),
    );
  }
  for (const control of [
    "<!-- prettier-ignore -->",
    "<!-- prettier-ignore-start -->",
    "<!-- prettier-ignore-end -->",
  ]) {
    for (const source of [
      `# Spacing\n\n${control}\n\n> First.\n>\n>\n> Second.\n`,
      `# Spacing\n\n> ${control}\n>\n> First.\n`,
      `# Spacing\n\n- ${control}\n  First.\n`,
    ]) {
      assert.doesNotThrow(() =>
        lintMarkdown({ files: [], strings: { "spacing.md": source } }),
      );
    }
    for (const source of [
      `# Spacing\n\n\`${control}\` is a literal example.\n`,
      `# Spacing\n\n\`\`\`text\n${control}\n\`\`\`\n`,
    ]) {
      assert.doesNotThrow(() =>
        lintMarkdown({ files: [], strings: { "spacing.md": source } }),
      );
    }
  }
  assert.doesNotThrow(() =>
    lintMarkdown({
      files: [],
      strings: {
        "spacing.md":
          "# Spacing\n\n<!-- prettier-ignore was discussed in review. -->\n\nUse the report.\n",
      },
    }),
  );
});

test("changelog categories may recur under different releases, not one release", () => {
  const lint = (source) =>
    lintMarkdown({ files: [], strings: { "fixture.md": source } });
  const first = "# Changelog\n\n## [4.0.1]\n\n### Fixed\n\n- New.\n\n";
  const second = "## [4.0.0]\n\n### Fixed\n\n- Old.\n";
  assert.doesNotThrow(() => lint(first + second));

  assert.throws(() => lint(first + "### Fixed\n\n- Duplicate.\n"), /MD024/u);
});
