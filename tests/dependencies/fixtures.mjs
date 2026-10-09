export const dependencyPolicy = `[[IgnoredVulns]]
id = "GHSA-vfj7-8cjw-p6xm"
ignoreUntil = 2026-10-18
reason = "Human-approved braces 3.0.3 in trusted development checks only."
`;
export const dependencyReviewTime = new Date("2026-10-07T00:00:00Z");
export const approvedFinding = () => ({
  id: "GHSA-vfj7-8cjw-p6xm",
  affected: [
    {
      package: { ecosystem: "npm", name: "braces" },
      ranges: [{ type: "SEMVER", events: [{ introduced: "0" }] }],
    },
  ],
});
