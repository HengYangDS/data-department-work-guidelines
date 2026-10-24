import { assertNodeRuntime, reportError, readText } from "../runtime.mjs";

async function checkRepository() {
  const { checkChangelog } = await import("./changelog.mjs");
  const { dependencyPolicyPath, parseDependencyPolicy, validateDependencyInput } =
    await import("./dependencies.mjs");
  validateDependencyInput(
    JSON.parse(readText("package-lock.json")),
    parseDependencyPolicy(readText(dependencyPolicyPath)),
  );
  checkChangelog();
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
    default:
      throw new Error("usage: node tools/docs/cli.mjs check|audit");
  }
} catch (error) {
  reportError(error);
  process.exitCode = 1;
}
