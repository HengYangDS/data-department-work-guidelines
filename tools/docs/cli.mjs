import { assertNodeRuntime, reportError, readText } from "../runtime.mjs";

async function checkRepository() {
  const { checkLicense } = await import("./governance.mjs");
  const { checkSourceBytes } = await import("./content.mjs");
  const { checkChangelog } = await import("./changelog.mjs");
  const { checkCi } = await import("./ci.mjs");
  const { dependencyPolicyPath, parseDependencyPolicy, validateDependencyInput } =
    await import("./dependencies.mjs");
  validateDependencyInput(
    JSON.parse(readText("package-lock.json")),
    parseDependencyPolicy(readText(dependencyPolicyPath)),
  );
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
