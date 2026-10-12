export const dependencyPolicy = `[[IgnoredVulns]]
id = "GHSA-vfj7-8cjw-p6xm"
reason = "User-accepted braces finding; checks and releases remain available."
`;
export const approvedFinding = () => ({
  id: "GHSA-vfj7-8cjw-p6xm",
  affected: [
    {
      package: { ecosystem: "npm", name: "braces" },
      ranges: [{ type: "SEMVER", events: [{ introduced: "0" }] }],
    },
  ],
});
