function safeSegment(value, kind) {
  if (
    typeof value !== "string" ||
    !/^[A-Za-z0-9][A-Za-z0-9._-]*$/u.test(value) ||
    value.includes("..")
  ) {
    throw new Error(`GitLab ${kind} is not portable`);
  }
  return value;
}

export function projectPackageRequest(
  { packageName, version, fileName },
  environment = process.env,
) {
  let api;
  try {
    api = new URL(environment.CI_API_V4_URL);
  } catch {
    throw new Error("GitLab CI API URL is missing or invalid");
  }
  const apiPath = api.pathname.replace(/\/+$/u, "");
  if (
    !["http:", "https:"].includes(api.protocol) ||
    api.username ||
    api.password ||
    api.search ||
    api.hash ||
    !apiPath.endsWith("/api/v4")
  ) {
    throw new Error("GitLab CI API URL is not a trusted API base");
  }
  const projectId = environment.CI_PROJECT_ID;
  const token = environment.CI_JOB_TOKEN;
  if (!/^\d+$/u.test(projectId ?? "")) {
    throw new Error("GitLab CI project ID is missing or invalid");
  }
  if (!token || /[\r\n]/u.test(token)) {
    throw new Error("GitLab CI job token is missing or invalid");
  }
  if (!/^[a-z][a-z0-9-]*$/u.test(packageName ?? "")) {
    throw new Error("GitLab package name is missing or invalid");
  }
  safeSegment(version, "package version");
  safeSegment(fileName, "asset name");
  const route = [
    apiPath,
    "projects",
    projectId,
    "packages/generic",
    packageName,
    encodeURIComponent(version),
    encodeURIComponent(fileName),
  ].join("/");
  return {
    url: new URL(route, api.origin).href,
    headers: { "JOB-TOKEN": token },
    redirect: "error",
  };
}
