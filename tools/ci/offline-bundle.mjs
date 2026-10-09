import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { reportError, root } from "../docs/runtime.mjs";
import { buildReleaseBundle } from "./offline/build.mjs";
import {
  acquireGitHubBundle,
  acquireGitLabBundle,
} from "./offline/acquire.mjs";
import { readBundleRecord, verifyBundle } from "./offline/artifact.mjs";
import { installBundle } from "./offline/install.mjs";

async function cli(argv) {
  const [mode, ...options] = argv;
  const parsed = parseArgs({
    args: options,
    options: {
      assets: { type: "string" },
      licenses: { type: "string" },
      output: { type: "string" },
      bundle: { type: "string" },
    },
    strict: true,
    allowPositionals: false,
  }).values;
  if (
    mode === "build" &&
    parsed.assets &&
    parsed.licenses &&
    parsed.output &&
    !parsed.bundle
  ) {
    const result = buildReleaseBundle({
      repository: root,
      assetDirectory: path.resolve(parsed.assets),
      licenseDirectory: path.resolve(parsed.licenses),
      outputPath: path.resolve(parsed.output),
    });
    console.error(`PASS ${result.packageCount} locked packages and licenses`);
    console.log(JSON.stringify(result.record, null, 2));
    return;
  }
  if (
    mode === "acquire-github" &&
    !parsed.bundle &&
    !parsed.assets &&
    !parsed.licenses &&
    !parsed.output
  ) {
    const result = await acquireGitHubBundle();
    console.log(`PASS offline acquisition: ${result.version} ${result.sha256}`);
    return;
  }
  if (
    mode === "acquire-gitlab" &&
    !parsed.bundle &&
    !parsed.assets &&
    !parsed.licenses &&
    !parsed.output
  ) {
    const result = await acquireGitLabBundle();
    console.log(`PASS offline acquisition: ${result.version} ${result.sha256}`);
    return;
  }
  if (
    (mode === "inspect" || mode === "install") &&
    !parsed.assets &&
    !parsed.licenses &&
    !parsed.output
  ) {
    const record = readBundleRecord();
    const bundlePath =
      parsed.bundle ??
      path.join(root, "build", "artifacts", "offline-bundle", record.fileName);
    const result =
      mode === "inspect"
        ? verifyBundle({ bundlePath, record })
        : installBundle({ bundlePath, record, repository: root });
    console.log(
      `PASS offline ${mode}: ${result.version} ${result.sha256}${mode === "install" ? ` npm ${result.npmVersion}` : ""}`,
    );
    return;
  }
  throw new Error(
    "usage: node tools/ci/offline-bundle.mjs build --assets DIR --licenses DIR --output FILE | acquire-github | acquire-gitlab | inspect [--bundle FILE] | install [--bundle FILE]",
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  cli(process.argv.slice(2)).catch((error) => {
    reportError(error);
    process.exitCode = 1;
  });
}
