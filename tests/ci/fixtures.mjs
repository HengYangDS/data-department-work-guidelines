import YAML from "yaml";
import { readText } from "../../tools/docs/runtime.mjs";

export const github = readText(".github/workflows/docs-verify.yml");
export const gitlab = readText(".gitlab-ci.yml");
export const offline = readText(".github/workflows/offline-verify.yml");

export function changedGitLab(jobName, change) {
  const pipeline = YAML.parse(gitlab);
  change(pipeline, pipeline[jobName]);
  return YAML.stringify(pipeline);
}
