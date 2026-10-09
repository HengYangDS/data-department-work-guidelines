import {
  assertNodeRuntime,
  gitFiles,
  reportError,
  run,
  validateOpenSpec,
  workspaceObservation,
} from "./runtime.mjs";

function testFiles() {
  return gitFiles().filter(
    (relative) =>
      relative.startsWith("tests/") && relative.endsWith(".test.mjs"),
  );
}

function runTests() {
  const files = testFiles();
  if (!files.length) throw new Error("no repository quality tests found");
  run(process.execPath, ["--test", "--test-concurrency=2", ...files], {
    timeout: 180_000,
  });
}

async function reportVerificationContext() {
  // Finish this record before synchronous children inherit the same stream.
  let onWriteError;
  await new Promise((resolve, reject) => {
    onWriteError = reject;
    process.stdout.once("error", onWriteError);
    process.stdout.write(
      `INFO ${JSON.stringify(workspaceObservation())}\n`,
      (error) => (error ? reject(error) : resolve()),
    );
  }).finally(() => process.stdout.off("error", onWriteError));
}

async function checkRepository() {
  const {
    checkConfigurationLayout,
    checkDecisions,
    checkLineEndingAttributes,
    checkLicense,
    checkNavigation,
    checkNoScope,
    checkProfile,
  } = await import("./governance.mjs");
  const {
    checkDocumentMetadata,
    checkLinks,
    checkProse,
    checkTextLayout,
    lintMarkdown,
  } = await import("./content.mjs");
  const { readBundleRecord } = await import("../ci/offline-bundle.mjs");
  const { checkChangelog } = await import("./changelog.mjs");
  const { checkCi } = await import("./ci.mjs");
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
      await reportVerificationContext();
      await checkRepository();
      break;
    case "verify": {
      if (arguments_.length) throw new Error("verify accepts no arguments");
      await reportVerificationContext();
      const { formatSource } = await import("./content.mjs");
      await formatSource();
      await checkRepository();
      runTests();
      console.log("PASS repository documentation verification");
      break;
    }
    case "format": {
      if (
        arguments_.length > 1 ||
        (arguments_.length === 1 && arguments_[0] !== "--check")
      ) {
        throw new Error("format accepts only --check");
      }
      const { formatSource } = await import("./content.mjs");
      await formatSource({ check: arguments_[0] === "--check" });
      break;
    }
    case "lint": {
      if (arguments_.length) throw new Error("lint accepts no arguments");
      const { lintMarkdown } = await import("./content.mjs");
      lintMarkdown();
      break;
    }
    case "audit": {
      if (arguments_.length) throw new Error("audit accepts no arguments");
      const { auditDependencies } = await import("./dependencies.mjs");
      auditDependencies();
      break;
    }
    case "prose": {
      if (arguments_.length) throw new Error("prose accepts no arguments");
      const { checkProse } = await import("./content.mjs");
      await checkProse();
      break;
    }
    case "links": {
      if (
        arguments_.length > 1 ||
        (arguments_.length === 1 && arguments_[0] !== "--online")
      ) {
        throw new Error("links accepts only --online");
      }
      const { checkLinks } = await import("./content.mjs");
      checkLinks({ online: arguments_[0] === "--online" });
      break;
    }
    case "changelog": {
      if (arguments_.length) throw new Error("changelog accepts no arguments");
      const { checkChangelog } = await import("./changelog.mjs");
      checkChangelog();
      break;
    }
    case "boundary": {
      if (arguments_.length) throw new Error("boundary accepts no arguments");
      const { checkDecisions, checkNoScope } = await import("./governance.mjs");
      checkDecisions();
      checkNoScope();
      break;
    }
    case "navigation": {
      if (arguments_.length) throw new Error("navigation accepts no arguments");
      const { checkNavigation } = await import("./governance.mjs");
      checkNavigation();
      break;
    }
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
