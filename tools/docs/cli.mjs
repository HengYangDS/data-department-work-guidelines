import { checkChangelog } from "./changelog.mjs";
import { checkCi } from "./ci.mjs";
import {
  checkDocumentMetadata,
  checkLinks,
  checkSpelling,
  checkTextLayout,
  formatSource,
  lintMarkdown,
} from "./content.mjs";
import {
  checkDecisions,
  checkLineEndingAttributes,
  checkNavigation,
  checkNoScope,
  checkProfile,
} from "./governance.mjs";
import { gitFiles, run, runNodeTool } from "./runtime.mjs";

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

function checkAll() {
  checkProfile();
  checkLineEndingAttributes();
  checkNoScope();
  checkChangelog();
  validateOpenSpec();
  lintMarkdown();
  checkSpelling();
  checkDocumentMetadata();
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
      if (arguments_.length) throw new Error("check accepts no arguments");
      checkAll();
      break;
    case "verify":
      if (arguments_.length) throw new Error("verify accepts no arguments");
      formatSource();
      checkAll();
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
        "usage: node tools/docs/cli.mjs verify|check|format|lint|prose|links|changelog|boundary|navigation|test",
      );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
