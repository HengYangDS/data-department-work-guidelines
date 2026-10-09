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
    !apiPath.endsWith("/api/v4") ||
    apiPath.includes("//")
  ) {
    throw new Error("GitLab CI API URL is not a trusted API base");
  }
  const projectId = environment.CI_PROJECT_ID;
  const token = environment.CI_JOB_TOKEN;
  if (!/^\d+$/u.test(projectId ?? "")) {
    throw new Error("GitLab CI project ID is missing or invalid");
  }
  if (typeof token !== "string" || !/^[\x21-\x7e]+$/u.test(token)) {
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
  const url = new URL(api.href);
  url.pathname = route;
  return {
    url: url.href,
    headers: { "JOB-TOKEN": token },
    redirect: "error",
  };
}

export function packageTransportFailure(error) {
  const descriptions = {
    ENOTFOUND: "name resolution failed",
    EAI_AGAIN: "name resolution unavailable",
    ECONNREFUSED: "connection refused",
    ECONNRESET: "connection reset",
    ETIMEDOUT: "connection timed out",
    UND_ERR_CONNECT_TIMEOUT: "connection timed out",
    UND_ERR_HEADERS_TIMEOUT: "response headers timed out",
    UND_ERR_BODY_TIMEOUT: "response body timed out",
    UND_ERR_SOCKET: "connection closed",
  };
  const code = error?.cause?.code ?? error?.code;
  if (Object.hasOwn(descriptions, code)) {
    return Object.assign(new Error(`package transport ${descriptions[code]}`), {
      code,
    });
  }
  if (["AbortError", "TimeoutError"].includes(error?.name)) {
    return new Error(
      `package transport ${error.name === "TimeoutError" ? "timed out" : "aborted"}`,
    );
  }
  if (error?.cause?.message === "unexpected redirect") {
    return new Error("authenticated package redirect refused");
  }
  return new Error("authenticated package transport failed");
}

export function downloadFailure(message, cause, authenticated = false) {
  return new Error(
    message,
    cause === undefined
      ? undefined
      : { cause: authenticated ? packageTransportFailure(cause) : cause },
  );
}
