import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { root, run as runCommand } from "../../tools/docs/runtime.mjs";
import {
  assembleBundle,
  checkPackageLicenses,
} from "../../tools/ci/offline/build.mjs";
import { validateExtractedBundle } from "../../tools/ci/offline/artifact.mjs";
import { buildFixture } from "../offline/fixtures.mjs";

test("package licensing accepts explicit native README declarations, not casual mentions", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-package-license-"),
  );
  try {
    const location = "node_modules/fixture";
    const packageDirectory = path.join(directory, location);
    mkdirSync(packageDirectory, { recursive: true });
    const lock = { packages: { [location]: {} } };
    const check = (manifest, readme) => {
      writeFileSync(
        path.join(packageDirectory, "package.json"),
        JSON.stringify(manifest),
      );
      writeFileSync(path.join(packageDirectory, "Readme.md"), readme);
      return checkPackageLicenses(directory, lock);
    };
    assert.equal(
      check({ license: "MIT" }, "# Fixture\n\n## License\n\nMIT\n"),
      1,
    );
    assert.equal(
      check(
        { licenses: [{ type: "MIT", url: "https://example.test/mit" }] },
        "Fixture\n=======\n\nLicense\n=======\n\n[MIT license](https://example.test/mit)\n",
      ),
      1,
    );
    assert.equal(
      check(
        { license: "BSD-3-Clause" },
        "# Fixture\n\n## License\n\nBSD-3-Clause\n",
      ),
      1,
    );
    const readerNotice =
      "# Fixture\n\n## **Lic&#101;nse**\n\n[MIT License](https://example.test/mit)\n";
    assert.equal(check({ license: "MIT" }, readerNotice), 1);
    assert.equal(
      readFileSync(path.join(packageDirectory, "Readme.md"), "utf8"),
      readerNotice,
    );
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
      assert.throws(
        () => check({ license: "MIT" }, readme),
        /lacks its license/u,
      );
    }
    assert.throws(
      () => check({}, "# Fixture\n\n## License\n\nMIT\n"),
      /lacks its license/u,
    );
    assert.throws(
      () =>
        check({ licenses: [{ type: "" }] }, "# Fixture\n\n## License\n\nMIT\n"),
      /lacks its license/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("the locked TOML plugin carries its full native MIT notice without sidecars", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-native-license-"));
  try {
    const location = "node_modules/@dprint/toml";
    const formatter = "node_modules/@dprint/formatter";
    const lock = JSON.parse(
      readFileSync(path.join(root, "package-lock.json"), "utf8"),
    );
    const selected = {
      packages: {
        [location]: lock.packages[location],
        [formatter]: lock.packages[formatter],
      },
    };
    for (const relative of [location, formatter]) {
      cpSync(path.join(root, relative), path.join(directory, relative), {
        recursive: true,
      });
    }
    writeFileSync(
      path.join(directory, "package.json"),
      '{ "private": true }\n',
    );
    const plugin = path.join(directory, location, "plugin.wasm");
    const original = readFileSync(plugin);
    const inventory = readdirSync(path.dirname(plugin));
    assert.equal(checkPackageLicenses(directory, selected), 2);
    assert.deepEqual(readFileSync(plugin), original);
    assert.deepEqual(readdirSync(path.dirname(plugin)), inventory);

    for (const invalid of [
      Buffer.from("invalid Wasm"),
      Buffer.from([0, 97, 115, 109, 1, 0, 0, 0]),
    ]) {
      writeFileSync(plugin, invalid);
      assert.throws(
        () => checkPackageLicenses(directory, selected),
        (error) => {
          assert.match(error.message, /native formatter license/u);
          if (invalid.equals(Buffer.from("invalid Wasm"))) {
            assert.ok(error.cause instanceof WebAssembly.CompileError);
          } else {
            assert.ok(error.cause instanceof Error);
          }
          return true;
        },
      );
      assert.deepEqual(readFileSync(plugin), invalid);
    }
    writeFileSync(plugin, original);
    const manifestPath = path.join(directory, location, "package.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    for (const field of [
      { name: "fixture" },
      { license: "BSD-3-Clause" },
      { version: "0.0.0" },
    ]) {
      writeFileSync(manifestPath, JSON.stringify({ ...manifest, ...field }));
      assert.throws(
        () => checkPackageLicenses(directory, selected),
        /native formatter license|lacks its license/u,
      );
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("a bundle covers both native owners and their notices", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const stage = path.join(path.dirname(inputs.outputPath), "qualified");
    mkdirSync(stage);
    runCommand("tar", ["-xf", inputs.outputPath, "-C", stage]);
    assert.doesNotThrow(() =>
      validateExtractedBundle(stage, inputs.repository),
    );
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
    assert.throws(
      () => validateExtractedBundle(stage, inputs.repository),
      /asset.*digest/u,
    );
    writeFileSync(valeAsset, original);
    rmSync(path.join(stage, "licenses", "vale", "LICENSE"));
    assert.throws(
      () => validateExtractedBundle(stage, inputs.repository),
      /license/u,
    );
    assert.equal(built.schemaVersion, 4);
    assert.equal("lycheeSha256" in built, false);
  });
});
