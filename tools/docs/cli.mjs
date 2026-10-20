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
  const { checkLineEndingAttributes, checkLicense } = await import("./governance.mjs");
  const { checkSourceBytes } = await import("./content.mjs");
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
  checkChangelog();
  await checkSourceBytes();
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
    case "changelog": {
      if (arguments_.length) throw new Error("changelog accepts no arguments");
      const { checkChangelog } = await import("./changelog.mjs");
      checkChangelog();
      break;
    }
    default:
      throw new Error("usage: node tools/docs/cli.mjs check|changelog|audit");
  }
} catch (error) {
  reportError(error);
  process.exitCode = 1;
}
