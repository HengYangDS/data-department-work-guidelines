import { realpathSync } from "node:fs";
import path from "node:path";
import { root, runNodeTool } from "./runtime.mjs";

export function validateOpenSpec() {
  const output = runNodeTool(
    "@fission-ai/openspec",
    "openspec",
    ["validate", "--all", "--strict", "--json"],
    {
      capture: true,
      rejectStderr: true,
      env: {
        ...Object.fromEntries(
          Object.entries(process.env).filter(
            ([key]) => key.toUpperCase() !== "OPENSPEC_TELEMETRY",
          ),
        ),
        OPENSPEC_TELEMETRY: "0",
      },
    },
  );
  const result = JSON.parse(output);
  const invalidReport = () => {
    throw new Error(
      "official OpenSpec validation report is incomplete or inconsistent",
    );
  };
  let reportedRoot;
  try {
    reportedRoot =
      typeof result?.root?.path === "string"
        ? realpathSync.native(result.root.path)
        : undefined;
  } catch {
    invalidReport();
  }
  if (
    result?.version !== "1.0" ||
    typeof result.root?.path !== "string" ||
    !path.isAbsolute(result.root.path) ||
    reportedRoot !== realpathSync.native(root) ||
    !Array.isArray(result.items) ||
    !result.items.length
  ) {
    invalidReport();
  }
  const counts = {
    change: { items: 0, passed: 0, failed: 0 },
    spec: { items: 0, passed: 0, failed: 0 },
  };
  const identities = new Set();
  const findings = [];
  for (const item of result.items) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !item.id.trim() ||
      typeof item.type !== "string" ||
      !Object.hasOwn(counts, item.type) ||
      typeof item.valid !== "boolean" ||
      !Array.isArray(item.issues) ||
      !Number.isFinite(item.durationMs) ||
      item.durationMs < 0
    ) {
      invalidReport();
    }
    const identity = `${item.type}:${item.id}`;
    if (identities.has(identity)) invalidReport();
    identities.add(identity);
    counts[item.type].items++;
    counts[item.type][item.valid ? "passed" : "failed"]++;
    for (const issue of item.issues) {
      if (
        !issue ||
        !["INFO", "WARNING", "ERROR"].includes(issue.level) ||
        typeof issue.path !== "string" ||
        typeof issue.message !== "string" ||
        !issue.message.trim()
      ) {
        invalidReport();
      }
      findings.push(
        `${identity} ${issue.path} [${issue.level}] ${issue.message}`,
      );
    }
  }
  const byType = result.summary?.byType;
  if (!byType || typeof byType !== "object" || Array.isArray(byType)) {
    invalidReport();
  }
  for (const type of new Set([
    ...Object.keys(counts),
    ...Object.keys(byType),
  ])) {
    if (!Object.hasOwn(counts, type) || !Object.hasOwn(byType, type))
      invalidReport();
    for (const key of ["items", "passed", "failed"]) {
      if (byType[type]?.[key] !== counts[type][key]) invalidReport();
    }
  }
  const passed = counts.change.passed + counts.spec.passed;
  const failed = counts.change.failed + counts.spec.failed;
  if (
    result.summary?.totals?.items !== result.items.length ||
    result.summary.totals.passed !== passed ||
    result.summary.totals.failed !== failed
  ) {
    invalidReport();
  }
  if (findings.length) {
    throw new Error(
      `official OpenSpec validation findings:\n${findings.join("\n")}`,
    );
  }
  if (failed) throw new Error("official OpenSpec validation did not pass");
  console.log(`PASS official OpenSpec: ${passed} items`);
}
