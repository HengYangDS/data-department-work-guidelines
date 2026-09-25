import { checkChangelog } from "./changelog.mjs";
import { checkCi } from "./ci.mjs";
import {
  checkDocuments,
  checkLinks,
  checkSpelling,
  checkTextLayout,
  formatSource,
  lintMarkdown,
} from "./content.mjs";
import {
  checkConfigPlacement,
  checkDecisions,
  checkNavigation,
  checkNoScope,
  checkPortableEntrypoints,
  checkProfile,
} from "./governance.mjs";
import { gitFiles, run, runNodeTool } from "./runtime.mjs";

function options(arguments_) {
  const parsed = {
    renderDir: "",
    hostedRendererConfig: process.env.DDWG_HOSTED_RENDERER_CONFIG || "",
  };
  for (let index = 0; index < arguments_.length; index += 1) {
    const name = arguments_[index];
    if (name === "--render-dir" || name === "--hosted-renderer-config") {
      const value = arguments_[index + 1];
      if (!value || value.startsWith("--"))
        throw new Error(`${name} requires a value`);
      parsed[name === "--render-dir" ? "renderDir" : "hostedRendererConfig"] =
        value;
      index += 1;
    } else {
      throw new Error(`unknown argument: ${name}`);
    }
  }
  return parsed;
}

function validateOpenSpec() {
  const output = runNodeTool(
    "@fission-ai/openspec",
    "openspec",
    ["validate", "--all", "--strict", "--json"],
    { capture: true },
  );
  const result = JSON.parse(output);
  if (result.summary?.totals?.failed !== 0 || !result.summary?.totals?.items) {
    throw new Error("official OpenSpec validation did not pass");
  }
  console.log(`PASS official OpenSpec: ${result.summary.totals.passed} items`);
}

function testFiles() {
  return gitFiles().filter((relative) =>
    /^tests\/[^/]+\.test\.mjs$/u.test(relative),
  );
}

function runTests() {
  const files = testFiles();
  if (!files.length) throw new Error("no repository quality tests found");
  run(process.execPath, ["--test", ...files], { timeout: 180_000 });
}

function checkAll(arguments_) {
  const render = options(arguments_);
  checkProfile();
  checkConfigPlacement();
  checkNoScope();
  checkPortableEntrypoints();
  checkChangelog();
  validateOpenSpec();
  formatSource();
  lintMarkdown();
  checkSpelling();
  checkDocuments(render);
  checkLinks();
  checkTextLayout();
  checkDecisions();
  checkNavigation();
  checkCi();
  runTests();
  console.log("PASS repository documentation verification");
}

const [command, ...arguments_] = process.argv.slice(2);
try {
  switch (command) {
    case "check":
      checkAll(arguments_);
      break;
    case "format":
      if (
        arguments_.length > 1 ||
        (arguments_.length === 1 && arguments_[0] !== "--check")
      ) {
        throw new Error("format accepts only --check");
      }
      formatSource({ check: arguments_[0] === "--check" });
      break;
    case "lint":
      if (arguments_.length) throw new Error("lint accepts no arguments");
      lintMarkdown();
      break;
    case "prose":
      if (arguments_.length) throw new Error("prose accepts no arguments");
      checkSpelling();
      break;
    case "render":
      checkDocuments(options(arguments_));
      break;
    case "links":
      if (arguments_.length) throw new Error("links accepts no arguments");
      checkLinks();
      break;
    case "changelog":
      if (arguments_.length) throw new Error("changelog accepts no arguments");
      checkChangelog();
      break;
    case "boundary":
      if (arguments_.length) throw new Error("boundary accepts no arguments");
      checkDecisions();
      checkNoScope();
      checkPortableEntrypoints();
      break;
    case "navigation":
      if (arguments_.length) throw new Error("navigation accepts no arguments");
      checkNavigation();
      break;
    case "test":
      if (arguments_.length) throw new Error("test accepts no arguments");
      runTests();
      break;
    default:
      throw new Error(
        "usage: node tools/docs/cli.mjs check|format|lint|prose|render|links|changelog|boundary|navigation|test",
      );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
