import {
  linkSync,
  mkdirSync,
  mkdtempDisposableSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { downloadFailure, projectPackageRequest } from "../gitlab-package.mjs";
import { managedFileExists, root } from "../../docs/runtime.mjs";
import { readBundleRecord, sha256, verifyBundle } from "./artifact.mjs";

async function downloadBundle(request, target, fetcher, provider) {
  let response;
  try {
    response = await fetcher(request.url, {
      headers: request.headers,
      redirect: request.redirect,
      signal: AbortSignal.timeout(90_000),
    });
  } catch (error) {
    throw downloadFailure(
      `${provider} release bundle download failed`,
      error,
      provider === "GitLab",
    );
  }
  if (!response.ok) {
    let cause;
    try {
      await response.body?.cancel();
    } catch (error) {
      cause = error;
    }
    throw downloadFailure(
      `${provider} release bundle download failed: HTTP ${response.status}`,
      cause,
      provider === "GitLab",
    );
  }
  if (!response.body) {
    throw new Error(`${provider} release bundle download returned no body`);
  }
  const limit = 512 * 1024 * 1024;
  const chunks = [];
  let size = 0;
  try {
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > limit) break;
      chunks.push(chunk);
    }
  } catch (error) {
    throw downloadFailure(
      size > limit
        ? `${provider} release bundle exceeds the size limit`
        : `${provider} release bundle download body failed`,
      error,
      provider === "GitLab",
    );
  }
  if (size > limit)
    throw new Error(`${provider} release bundle exceeds the size limit`);
  writeFileSync(target, Buffer.concat(chunks), { flag: "wx" });
}

async function acquireBundle({
  repository,
  record,
  request,
  fetcher,
  provider,
}) {
  const directory = path.join(repository, "build/artifacts/offline-bundle");
  const target = path.join(directory, record.fileName);
  if (managedFileExists(target, repository))
    return verifyBundle({ bundlePath: target, record, repository });
  mkdirSync(directory, { recursive: true });
  using acquiring = mkdtempDisposableSync(path.join(directory, ".acquire-"));
  const temporary = acquiring.path;
  const staged = path.join(temporary, record.fileName);
  await downloadBundle(request, staged, fetcher, provider);
  const verified = verifyBundle({ bundlePath: staged, record, repository });
  try {
    linkSync(staged, target);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    return verifyBundle({ bundlePath: target, record, repository });
  }
  return verified;
}

export async function acquireGitHubBundle({
  repository = root,
  environment = process.env,
  fetcher = fetch,
} = {}) {
  const record = readBundleRecord(repository);
  const tag = environment.DDWG_RELEASE_TAG;
  const githubRepository = environment.GITHUB_REPOSITORY;
  if (tag !== `v${record.version}`) {
    throw new Error("GitHub release tag does not match source version");
  }
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(githubRepository ?? "")) {
    throw new Error("GitHub repository identity is missing or invalid");
  }
  if (
    environment.GITHUB_SERVER_URL !== undefined &&
    environment.GITHUB_SERVER_URL !== "https://github.com"
  ) {
    throw new Error("public GitHub release origin is unsupported");
  }
  return acquireBundle({
    repository,
    record,
    request: {
      url: `https://github.com/${githubRepository}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(record.fileName)}`,
      headers: {},
      redirect: "follow",
    },
    fetcher,
    provider: "GitHub",
  });
}

export function gitlabBundleRequest(record, environment = process.env) {
  const candidate = environment.DDWG_OFFLINE_CANDIDATE;
  if (candidate) {
    if (
      !sha256(candidate) ||
      candidate !== record.sha256 ||
      environment.CI_COMMIT_TAG ||
      environment.CI_COMMIT_REF_PROTECTED !== "true" ||
      !["dev", "main"].includes(environment.CI_COMMIT_BRANCH) ||
      !["api", "web"].includes(environment.CI_PIPELINE_SOURCE)
    ) {
      throw new Error(
        "GitLab candidate qualification must bind protected source to its frozen bundle digest",
      );
    }
    return projectPackageRequest(
      {
        packageName: "offline-qualification",
        version: `sha256-${candidate}`,
        fileName: record.fileName,
      },
      environment,
    );
  }
  if (
    environment.CI_COMMIT_TAG !== `v${record.version}` ||
    !["api", "web"].includes(environment.CI_PIPELINE_SOURCE)
  ) {
    throw new Error("GitLab release pipeline does not match the source tag");
  }
  return projectPackageRequest(
    {
      packageName: "release-assets",
      version: `v${record.version}`,
      fileName: record.fileName,
    },
    environment,
  );
}

export async function acquireGitLabBundle({
  repository = root,
  environment = process.env,
  fetcher = fetch,
} = {}) {
  const record = readBundleRecord(repository);
  const request = gitlabBundleRequest(record, environment);
  return acquireBundle({
    repository,
    record,
    request,
    fetcher,
    provider: "GitLab",
  });
}
