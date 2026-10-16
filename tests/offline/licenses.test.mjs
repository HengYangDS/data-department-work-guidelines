import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { run as runCommand } from "../../tools/runtime.mjs";
import { assembleBundle, checkPackageLicenses } from "../../tools/ci/offline/build.mjs";
import { validateExtractedBundle } from "../../tools/ci/offline/artifact.mjs";
import { buildFixture } from "../offline/fixtures.mjs";

test("package licensing accepts explicit native README declarations, not casual mentions", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-package-license-"));
  try {
    const location = "node_modules/fixture";
    const packageDirectory = path.join(directory, location);
    mkdirSync(packageDirectory, { recursive: true });
    const lock = { packages: { [location]: {} } };
    const check = (manifest, readme) => {
      writeFileSync(path.join(packageDirectory, "package.json"), JSON.stringify(manifest));
      writeFileSync(path.join(packageDirectory, "Readme.md"), readme);
      return checkPackageLicenses(directory, lock);
    };
    assert.equal(check({ license: "MIT" }, "# Fixture\n\n## License\n\nMIT\n"), 1);
    assert.equal(
      check(
        { licenses: [{ type: "MIT", url: "https://example.test/mit" }] },
        "Fixture\n=======\n\nLicense\n=======\n\n[MIT license](https://example.test/mit)\n",
      ),
      1,
    );
    assert.equal(
      check({ license: "BSD-3-Clause" }, "# Fixture\n\n## License\n\nBSD-3-Clause\n"),
      1,
    );
    const readerNotice =
      "# Fixture\n\n## **Lic&#101;nse**\n\n[MIT License](https://example.test/mit)\n";
    assert.equal(check({ license: "MIT" }, readerNotice), 1);
    assert.equal(readFileSync(path.join(packageDirectory, "Readme.md"), "utf8"), readerNotice);
    for (const readme of [
      "# Fixture\n\nMIT is mentioned in usage.\n",
      "# Fixture\n\n```text\n## License\nMIT\n```\n",
      "# Fixture\n\n## License\n\n## Usage\n\nMIT\n",
      "# Fixture\n\n## License\n\nNo permission is granted.\n",
      "# Fixture\n\n## License\n\nBSD-3-Clause\n",
      "# Fixture\n\n> ## License\n> MIT\n",
      "# Fixture\n\n## License\n\n`MIT` is only an example.\n",
      "# Fixture\n\n## License\n\n[Read the notice](https://example.test/MIT)\n",
      "# Fixture\n\n## License\n\n<!-- MIT -->\n",
      "# Fixture\n\n## License\n\n```text\nMIT\n```\n",
    ]) {
      assert.throws(() => check({ license: "MIT" }, readme), /lacks its license/u);
    }
    assert.throws(() => check({}, "# Fixture\n\n## License\n\nMIT\n"), /lacks its license/u);
    assert.throws(
      () => check({ licenses: [{ type: "" }] }, "# Fixture\n\n## License\n\nMIT\n"),
      /lacks its license/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("a bundle covers both native owners and their notices", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const stage = path.join(path.dirname(inputs.outputPath), "qualified");
    mkdirSync(stage);
    runCommand("tar", ["-xf", inputs.outputPath, "-C", stage]);
    assert.doesNotThrow(() => validateExtractedBundle(stage, inputs.repository));
    const supply = JSON.parse(
      readFileSync(path.join(inputs.repository, ".config/supply/native.json")),
    );
    const valeAsset = path.join(
      stage,
      "native",
      "vale",
      Object.values(supply.tools.vale.assets)[0].name,
    );
    const original = readFileSync(valeAsset);
    writeFileSync(valeAsset, "changed");
    assert.throws(() => validateExtractedBundle(stage, inputs.repository), /asset.*digest/u);
    writeFileSync(valeAsset, original);
    rmSync(path.join(stage, "licenses", "vale", "LICENSE"));
    assert.throws(() => validateExtractedBundle(stage, inputs.repository), /license/u);
    assert.equal(built.schemaVersion, 4);
    assert.equal("lycheeSha256" in built, false);
  });
});
