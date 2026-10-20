import { assertNodeRuntime, reportError, readText, workspaceObservation } from "../runtime.mjs";

async function reportVerificationContext() {
  // Finish this record before synchronous children inherit the same stream.
  let onWriteError;
  await new Promise((resolve, reject) => {
    onWriteError = reject;
    process.stdout.once("error", onWriteError);
    process.stdout.write(`INFO ${JSON.stringify(workspaceObservation())}\n`, (error) =>
      error ? reject(error) : resolve(),
    );
  }).finally(() => process.stdout.off("error", onWriteError));
}

async function checkRepository() {
  const { checkLineEndingAttributes, checkLicense, checkNavigation, checkNoScope } =
    await import("./governance.mjs");
  const { checkProse, checkTextLayout } = await import("./content.mjs");
  const { checkChangelog } = await import("./changelog.mjs");
  const { checkCi } = await import("./ci.mjs");
  const { dependencyPolicyPath, parseDependencyPolicy, validateDependencyInput } =
    await import("./dependencies.mjs");
  validateDependencyInput(
    JSON.parse(readText("package-lock.json")),
    parseDependencyPolicy(readText(dependencyPolicyPath)),
  );
  checkLineEndingAttributes();
  checkLicense();
  checkNoScope();
  await checkProse();
  checkChangelog();
  await checkTextLayout();
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
    case "changelog": {
      if (arguments_.length) throw new Error("changelog accepts no arguments");
      const { checkChangelog } = await import("./changelog.mjs");
      checkChangelog();
      break;
    }
    case "navigation": {
      if (arguments_.length) throw new Error("navigation accepts no arguments");
      const { checkNavigation } = await import("./governance.mjs");
      checkNavigation();
      break;
    }
    default:
      throw new Error("usage: node tools/docs/cli.mjs check|prose|changelog|navigation|audit");
  }
} catch (error) {
  reportError(error);
  process.exitCode = 1;
}
