import { readBundleRecord } from "../ci/offline-bundle.mjs";
import { checkChangelog } from "./changelog.mjs";
import { auditDependencies, checkCi } from "./ci.mjs";
import {
  checkDocumentMetadata,
  checkLinks,
  checkProse,
  checkTextLayout,
  formatSource,
  lintMarkdown,
} from "./content.mjs";
import {
  checkConfigurationLayout,
  checkDecisions,
  checkLineEndingAttributes,
  checkLicense,
  checkNavigation,
  checkNoScope,
  checkProfile,
} from "./governance.mjs";
import {
  assertNodeRuntime,
  gitFiles,
  reportError,
  run,
  validateOpenSpec,
  workspaceObservation,
} from "./runtime.mjs";

function testFiles() {
  return gitFiles().filter((relative) =>
    /^tests\/[^/]+\.test\.mjs$/u.test(relative),
  );
}

function runTests() {
  const files = testFiles();
  if (!files.length) throw new Error("no repository quality tests found");
  run(process.execPath, ["--test", "--test-concurrency=2", ...files], {
    timeout: 180_000,
  });
}

async function checkRepository() {
  console.log(`INFO ${JSON.stringify(workspaceObservation())}`);
  checkConfigurationLayout();
  checkProfile();
  checkLineEndingAttributes();
  checkLicense();
  const bundle = readBundleRecord();
  console.log(`PASS source-pinned offline bundle identity: v${bundle.version}`);
  checkNoScope();
  await checkProse();
  checkChangelog();
  validateOpenSpec();
  lintMarkdown();
  checkDocumentMetadata();
  checkLinks();
  await checkTextLayout();
  checkDecisions();
  checkNavigation();
  checkCi();
  console.log("PASS repository source checks");
}

const [command, ...arguments_] = process.argv.slice(2);
try {
  assertNodeRuntime();
  switch (command) {
    case "check":
      if (arguments_.length) throw new Error("check accepts no arguments");
      await checkRepository();
      break;
    case "verify":
      if (arguments_.length) throw new Error("verify accepts no arguments");
      await formatSource();
      await checkRepository();
      runTests();
      console.log("PASS repository documentation verification");
      break;
    case "format":
      if (
        arguments_.length > 1 ||
        (arguments_.length === 1 && arguments_[0] !== "--check")
      ) {
        throw new Error("format accepts only --check");
      }
      await formatSource({ check: arguments_[0] === "--check" });
      break;
    case "lint":
      if (arguments_.length) throw new Error("lint accepts no arguments");
      lintMarkdown();
      break;
    case "audit":
      if (arguments_.length) throw new Error("audit accepts no arguments");
      auditDependencies();
      break;
    case "prose":
      if (arguments_.length) throw new Error("prose accepts no arguments");
      await checkProse();
      break;
    case "links":
      if (
        arguments_.length > 1 ||
        (arguments_.length === 1 && arguments_[0] !== "--online")
      ) {
        throw new Error("links accepts only --online");
      }
      checkLinks({ online: arguments_[0] === "--online" });
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
        "usage: node tools/docs/cli.mjs verify|check|format|lint|prose|links [--online]|changelog|boundary|navigation|audit|test",
      );
  }
} catch (error) {
  reportError(error);
  process.exitCode = 1;
}
