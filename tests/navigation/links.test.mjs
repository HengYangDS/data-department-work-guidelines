import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { checkNavigation } from "../../tools/docs/governance.mjs";
import { fixture } from "../governance/fixtures.mjs";

test("navigation requires a rendered link rather than an example or image", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    assert.ok(original.includes(route));
    for (const replacement of [
      `\`${route}\``,
      `\n\n\`\`\`text\n${route}\n\`\`\`\n\n`,
      `<!-- ${route} -->`,
      `!${route}`,
      "![Preview with [documentation map](docs/README.md)](preview.png)",
      "\\[documentation map](docs/README.md)",
      "[documentation map](https://example.test/docs/README.md)",
      "the documentation map\n\n[unused]: docs/README.md",
      "[documentation map][task-map]\n\n[task-map]: https://example.test/\n\n[task-map]: docs/README.md",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.throws(
        () => checkNavigation(directory),
        /missing task routes/u,
        replacement,
      );
    }
  });
});

test("navigation resolves native link destinations and first reference definitions", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    for (const replacement of [
      '[documentation map](docs/README.md "Task map")',
      "[documentation map](<docs/README.md>)",
      "[documentation map](./docs/README.md)",
      "[documentation map](docs/README.md#start-with-the-work-question)",
      "[documentation map](docs/REA&#68;ME.md)",
      "[documentation map](docs/%52EADME.md)",
      "[documentation map][task-map]\n\n[task-map]: docs/README.md",
      "[documentation map][SS]\n\n[ß]: docs/README.md",
      "[documentation map][ß]\n\n[SS]: docs/README.md",
      "[documentation map][TASK MAP]\n\n[task map]: docs/README.md",
      "[documentation map][]\n\n[documentation map]: docs/README.md",
      "[documentation map]\n\n[documentation map]: docs/README.md",
      "[documentation map][task-map]\n\n[task-map]: docs/README.md\n\n[task-map]: https://example.test/",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.doesNotThrow(() => checkNavigation(directory), replacement);
    }
  });
});

test("navigation follows native GFM table cell boundaries", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    const table = (cell) =>
      `\n\n| Task | Entry |\n| --- | --- |\n| Start | ${cell} |\n\n`;
    for (const cell of [route, "[documentation \\| map](docs/README.md)"]) {
      writeFileSync(entry, original.replace(route, table(cell)));
      assert.doesNotThrow(() => checkNavigation(directory), cell);
    }
    for (const cell of [
      "[documentation | map](docs/README.md)",
      "unlinked | [documentation map](docs/README.md)",
    ]) {
      writeFileSync(entry, original.replace(route, table(cell)));
      assert.throws(
        () => checkNavigation(directory),
        /missing task routes/u,
        cell,
      );
    }
  });
});

test("navigation rejects anchors without readable rendered content", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    for (const replacement of [
      "[](docs/README.md)",
      '[ ](docs/README.md "Task map")',
      "[\n\t](docs/README.md)",
      "[&#32;&nbsp;](docs/README.md)",
      "[\u200b\u2060\u00ad](docs/README.md)",
      "[ ][task-map]\n\n[task-map]: docs/README.md",
      "[![](preview.png)](docs/README.md)",
      "[![&#32;&nbsp;](preview.png)](docs/README.md)",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.throws(
        () => checkNavigation(directory),
        /missing task routes/u,
        replacement,
      );
    }
  });
});

test("navigation preserves formatted text and descriptive linked-image labels", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    for (const replacement of [
      "[**Task** `map`](docs/README.md)",
      "[&#84;ask map](docs/README.md)",
      "[\u200bTask map\u2060](docs/README.md)",
      "[![Task map](preview.png)](docs/README.md)",
      "[![&#84;ask map](preview.png)][task-map]\n\n[task-map]: docs/README.md",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.doesNotThrow(() => checkNavigation(directory), replacement);
    }
  });
});

test("navigation detects real duplicate topic routes without counting examples", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    for (const duplicate of [
      '[Charter](docs/charter.md "Charter")',
      "[Charter](./docs/charter.md)",
      "[Charter](docs/char&#116;er.md)",
      "[Charter][charter]\n\n[charter]: docs/charter.md",
      "[Charter][SS]\n\n[ß]: docs/charter.md",
    ]) {
      writeFileSync(entry, `${original}\n${duplicate}\n`);
      assert.throws(
        () => checkNavigation(directory),
        /repeats topic routes/u,
        duplicate,
      );
    }
    for (const example of [
      "`[Charter](docs/charter.md)`",
      "<!-- [Charter](docs/charter.md) -->",
      "```text\n[Charter](docs/charter.md)\n```",
    ]) {
      writeFileSync(entry, `${original}\n${example}\n`);
      assert.doesNotThrow(() => checkNavigation(directory), example);
    }
  });
});

test("navigation requires the reader cue in the visible topic opening", () => {
  fixture((directory) => {
    const topic = path.join(directory, "docs", "decide.md");
    const original = readFileSync(topic, "utf8");
    for (const replacement of [
      "`**When to use:**`",
      "<!-- **When to use:** -->",
      "\n\n```text\n**When to use:**\n```\n\n",
      "![When to use:](../README.md)",
    ]) {
      writeFileSync(topic, original.replace("**When to use:**", replacement));
      assert.throws(
        () => checkNavigation(directory),
        /missing reader entry/u,
        replacement,
      );
    }
    writeFileSync(topic, original.replace("**When to use:**", "When to use:"));
    assert.doesNotThrow(() => checkNavigation(directory));
  });
});
