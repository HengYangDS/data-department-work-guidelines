import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  acquireGitHubBundle,
  acquireGitLabBundle,
  gitlabBundleRequest,
} from "../../tools/ci/offline/acquire.mjs";
import { assembleBundle } from "../../tools/ci/offline/build.mjs";
import {
  digest,
  record,
  buildFixture,
  pathExistsForTest,
} from "../offline/fixtures.mjs";

test("rejected Forge downloads await response disposal without publishing output", async () => {
  for (const [acquire, environment, provider] of [
    [
      acquireGitHubBundle,
      { GITHUB_REPOSITORY: "Example/Repository", DDWG_RELEASE_TAG: "v4.2.0" },
      "GitHub",
    ],
    [
      acquireGitLabBundle,
      {
        CI_API_V4_URL: "http://gitlab.example.test/api/v4",
        CI_PROJECT_ID: "42",
        CI_JOB_TOKEN: "fixture-only",
        CI_COMMIT_TAG: "v4.2.0",
        CI_PIPELINE_SOURCE: "api",
      },
      "GitLab",
    ],
  ]) {
    const cause = new Error("native response disposal failed");
    for (const cleanupFailure of [undefined, cause]) {
      await buildFixture(async (inputs) => {
        const built = assembleBundle(inputs);
        writeFileSync(
          path.join(inputs.repository, ".config/release/offline-bundle.json"),
          JSON.stringify(built),
        );
        let requests = 0;
        let disposed = false;
        const fetcher = async () => {
          requests += 1;
          return new Response(
            new ReadableStream({
              async cancel() {
                await new Promise((resolve) => setImmediate(resolve));
                disposed = true;
                if (cleanupFailure) throw cleanupFailure;
              },
            }),
            { status: 500 },
          );
        };
        await assert.rejects(
          acquire({ repository: inputs.repository, environment, fetcher }),
          (error) =>
            error.message ===
              `${provider} release bundle download failed: HTTP 500` &&
            (provider === "GitLab" && cleanupFailure !== undefined
              ? error.cause !== cleanupFailure &&
                error.cause?.message ===
                  "authenticated package transport failed"
              : error.cause === cleanupFailure) &&
            Object.hasOwn(error, "cause") === (cleanupFailure !== undefined),
        );
        assert.equal(requests, 1);
        assert.equal(disposed, true);
        assert.deepEqual(
          readdirSync(
            path.join(inputs.repository, "build/artifacts/offline-bundle"),
          ),
          [],
        );
        assert.equal(existsSync(inputs.outputPath), true);
      });
    }
  }
});

test("a failed concurrent acquisition preserves either Forge's verified output", async () => {
  for (const [acquire, environment] of [
    [
      acquireGitHubBundle,
      { GITHUB_REPOSITORY: "Example/Repository", DDWG_RELEASE_TAG: "v4.2.0" },
    ],
    [
      acquireGitLabBundle,
      {
        CI_API_V4_URL: "http://gitlab.example.test/api/v4",
        CI_PROJECT_ID: "42",
        CI_JOB_TOKEN: "fixture-only",
        CI_COMMIT_TAG: "v4.2.0",
        CI_PIPELINE_SOURCE: "api",
      },
    ],
  ]) {
    for (const failedResponse of [
      () => new Response(null, { status: 503 }),
      () => new Response("changed archive", { status: 200 }),
    ]) {
      await buildFixture(async (inputs) => {
        const built = assembleBundle(inputs);
        writeFileSync(
          path.join(inputs.repository, ".config/release/offline-bundle.json"),
          JSON.stringify(built),
        );
        const target = path.join(
          inputs.repository,
          "build/artifacts/offline-bundle",
          built.fileName,
        );
        const pending = Promise.withResolvers();
        const successful = acquire({
          repository: inputs.repository,
          environment,
          fetcher: async () => new Response(readFileSync(inputs.outputPath)),
        });
        const failed = assert.rejects(
          acquire({
            repository: inputs.repository,
            environment,
            fetcher: () => pending.promise,
          }),
          /HTTP 503|digest mismatch/u,
        );
        assert.equal((await successful).sha256, built.sha256);
        assert.equal(digest(readFileSync(target)), built.sha256);
        pending.resolve(failedResponse());
        await failed;
        assert.equal(digest(readFileSync(target)), built.sha256);
        assert.deepEqual(readdirSync(path.dirname(target)), [built.fileName]);
      });
    }
  }
});

test("bundle acquisition rejects linked managed parents before remote access", async () => {
  for (const [acquire, environment] of [
    [
      acquireGitHubBundle,
      { GITHUB_REPOSITORY: "Example/Repository", DDWG_RELEASE_TAG: "v4.2.0" },
    ],
    [
      acquireGitLabBundle,
      {
        CI_API_V4_URL: "http://gitlab.example.test/api/v4",
        CI_PROJECT_ID: "42",
        CI_JOB_TOKEN: "fixture-only",
        CI_COMMIT_TAG: "v4.2.0",
        CI_PIPELINE_SOURCE: "api",
      },
    ],
  ]) {
    for (const relative of [
      "build",
      "build/artifacts",
      "build/artifacts/offline-bundle",
    ]) {
      await buildFixture(async (inputs) => {
        const built = assembleBundle(inputs);
        writeFileSync(
          path.join(inputs.repository, ".config/release/offline-bundle.json"),
          JSON.stringify(built),
        );
        const foreign = mkdtempSync(
          path.join(os.tmpdir(), "ddwg-acquisition-foreign-"),
        );
        const marker = path.join(foreign, "preserved.txt");
        writeFileSync(marker, "existing external content");
        const alias = path.join(inputs.repository, relative);
        mkdirSync(path.dirname(alias), { recursive: true });
        symlinkSync(foreign, alias, "junction");
        let requests = 0;
        try {
          await assert.rejects(
            acquire({
              repository: inputs.repository,
              environment,
              fetcher: async () => {
                requests += 1;
                return new Response(readFileSync(inputs.outputPath));
              },
            }),
            /regular|symbolic|directory/u,
          );
          assert.equal(requests, 0);
          assert.deepEqual(readdirSync(foreign), ["preserved.txt"]);
          assert.equal(
            readFileSync(marker, "utf8"),
            "existing external content",
          );
        } finally {
          unlinkSync(alias);
          rmSync(foreign, { recursive: true, force: true });
        }
      });
    }
  }
});

test("concurrent successful acquisitions converge without replacing a prior target", async () => {
  await buildFixture(async (inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, ".config/release/offline-bundle.json"),
      JSON.stringify(built),
    );
    const options = {
      repository: inputs.repository,
      environment: {
        GITHUB_REPOSITORY: "Example/Repository",
        DDWG_RELEASE_TAG: "v4.2.0",
      },
      fetcher: async () => new Response(readFileSync(inputs.outputPath)),
    };
    const results = await Promise.all([
      acquireGitHubBundle(options),
      acquireGitHubBundle(options),
    ]);
    assert.deepEqual(
      results.map((result) => result.sha256),
      [built.sha256, built.sha256],
    );
    const target = path.join(
      inputs.repository,
      "build/artifacts/offline-bundle",
      built.fileName,
    );
    writeFileSync(target, "unqualified existing output");
    await assert.rejects(
      acquireGitHubBundle({
        ...options,
        fetcher: () => {
          throw new Error("an existing target must not be replaced");
        },
      }),
      /digest mismatch/u,
    );
    assert.equal(readFileSync(target, "utf8"), "unqualified existing output");
  });
});

test("GitLab candidate acquisition binds accepted job source to the frozen digest", () => {
  const bundle = record();
  const environment = {
    CI_API_V4_URL: "http://gitlab.example.test/api/v4",
    CI_PROJECT_ID: "12345",
    CI_JOB_TOKEN: "fixture-only",
    CI_COMMIT_BRANCH: "dev",
    CI_COMMIT_REF_PROTECTED: "true",
    CI_PIPELINE_SOURCE: "api",
    DDWG_OFFLINE_CANDIDATE: bundle.sha256,
  };
  for (const branch of ["dev", "main"]) {
    for (const event of ["api", "web"]) {
      const request = gitlabBundleRequest(bundle, {
        ...environment,
        CI_COMMIT_BRANCH: branch,
        CI_PIPELINE_SOURCE: event,
      });
      assert.equal(
        request.url,
        `http://gitlab.example.test/api/v4/projects/12345/packages/generic/offline-qualification/sha256-${bundle.sha256}/${bundle.fileName}`,
      );
      assert.deepEqual(request.headers, { "JOB-TOKEN": "fixture-only" });
      assert.equal(request.redirect, "error");
    }
  }
  for (const changed of [
    { CI_COMMIT_BRANCH: "proposal/review" },
    { CI_COMMIT_BRANCH: "work/local" },
    { CI_COMMIT_BRANCH: "candidate/dev" },
    { CI_COMMIT_REF_PROTECTED: "false" },
    { CI_COMMIT_REF_PROTECTED: undefined },
    { CI_COMMIT_TAG: "v4.2.0" },
    { CI_PIPELINE_SOURCE: "push" },
    { CI_PIPELINE_SOURCE: "merge_request_event" },
    { DDWG_OFFLINE_CANDIDATE: digest("other bundle") },
    { DDWG_OFFLINE_CANDIDATE: "../unbound" },
  ]) {
    assert.throws(
      () => gitlabBundleRequest(bundle, { ...environment, ...changed }),
      /candidate qualification/u,
    );
  }
});

test("GitLab candidate acquisition verifies exact bytes and retires its download stage", async () => {
  await buildFixture(async (inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, ".config", "release", "offline-bundle.json"),
      JSON.stringify(built),
    );
    const environment = {
      CI_API_V4_URL: "http://gitlab.example.test/api/v4",
      CI_PROJECT_ID: "12345",
      CI_JOB_TOKEN: "fixture-only",
      CI_COMMIT_BRANCH: "dev",
      CI_COMMIT_REF_PROTECTED: "true",
      CI_PIPELINE_SOURCE: "api",
      DDWG_OFFLINE_CANDIDATE: built.sha256,
    };
    let calls = 0;
    const fetcher = async (url, options) => {
      calls += 1;
      assert.equal(
        url,
        `http://gitlab.example.test/api/v4/projects/12345/packages/generic/offline-qualification/sha256-${built.sha256}/${built.fileName}`,
      );
      assert.deepEqual(options.headers, { "JOB-TOKEN": "fixture-only" });
      assert.equal(options.redirect, "error");
      return new Response(readFileSync(inputs.outputPath));
    };
    const result = await acquireGitLabBundle({
      repository: inputs.repository,
      environment,
      fetcher,
    });
    assert.equal(result.sha256, built.sha256);
    assert.equal(calls, 1);
    const directory = path.join(
      inputs.repository,
      "build/artifacts/offline-bundle",
    );
    assert.deepEqual(readdirSync(directory), [built.fileName]);
    assert.equal(
      digest(readFileSync(path.join(directory, built.fileName))),
      built.sha256,
    );
  });
});

test("GitLab acquisition uses only the same project's pinned release package", async () => {
  assert.equal(typeof gitlabBundleRequest, "function");
  assert.equal(typeof acquireGitLabBundle, "function");
  await buildFixture(async (inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, ".config", "release", "offline-bundle.json"),
      JSON.stringify(built),
    );
    const environment = {
      CI_API_V4_URL: "http://gitlab.example.test/api/v4",
      CI_PROJECT_ID: "12345",
      CI_JOB_TOKEN: "fixture-only",
      CI_COMMIT_TAG: "v4.2.0",
      CI_PIPELINE_SOURCE: "api",
    };
    const request = gitlabBundleRequest(built, environment);
    assert.equal(
      request.url,
      `http://gitlab.example.test/api/v4/projects/12345/packages/generic/release-assets/v4.2.0/${built.fileName}`,
    );
    assert.deepEqual(request.headers, { "JOB-TOKEN": "fixture-only" });
    assert.equal(request.redirect, "error");
    for (const changed of [
      { CI_API_V4_URL: "http://gitlab.example.test/other" },
      { CI_PROJECT_ID: "other" },
      { CI_JOB_TOKEN: "" },
      { CI_JOB_TOKEN: "line\nbreak" },
      { CI_COMMIT_TAG: "v4.1.1" },
      { CI_PIPELINE_SOURCE: "push" },
    ]) {
      assert.throws(() =>
        gitlabBundleRequest(built, { ...environment, ...changed }),
      );
    }
    assert.throws(
      () =>
        gitlabBundleRequest(
          { ...built, fileName: "../outside.tar.gz" },
          environment,
        ),
      /asset name/u,
    );
    const bytes = readFileSync(inputs.outputPath);
    let calls = 0;
    const fetcher = async (url, options) => {
      calls += 1;
      assert.equal(url, request.url);
      assert.equal(options.redirect, "error");
      assert.equal(options.headers["JOB-TOKEN"], "fixture-only");
      return new Response(bytes, { status: 200 });
    };
    const result = await acquireGitLabBundle({
      repository: inputs.repository,
      environment,
      fetcher,
    });
    assert.equal(result.sha256, built.sha256);
    assert.equal(calls, 1);
    assert.equal(
      (
        await acquireGitLabBundle({
          repository: inputs.repository,
          environment,
          fetcher: () => {
            throw new Error("must not download twice");
          },
        })
      ).sha256,
      built.sha256,
    );
  });
  await buildFixture(async (inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, ".config", "release", "offline-bundle.json"),
      JSON.stringify(built),
    );
    const target = path.join(
      inputs.repository,
      "build",
      "artifacts",
      "offline-bundle",
      built.fileName,
    );
    const environment = {
      CI_API_V4_URL: "http://gitlab.example.test/api/v4",
      CI_PROJECT_ID: "12345",
      CI_JOB_TOKEN: "fixture-only",
      CI_COMMIT_TAG: "v4.2.0",
      CI_PIPELINE_SOURCE: "api",
    };
    for (const fetcher of [
      async () => new Response("altered", { status: 200 }),
      async () =>
        new Response("redirect", {
          status: 302,
          headers: { Location: "https://other.example.test/asset" },
        }),
      async () => new Response("missing", { status: 404 }),
    ]) {
      await assert.rejects(() =>
        acquireGitLabBundle({
          repository: inputs.repository,
          environment,
          fetcher,
        }),
      );
      assert.equal(pathExistsForTest(target), false);
    }
    await assert.rejects(
      () =>
        acquireGitLabBundle({
          repository: inputs.repository,
          environment,
          fetcher: async () => {
            throw new Error("fixture-only must not leak");
          },
        }),
      (error) =>
        error.message === "GitLab release bundle download failed" &&
        !error.message.includes("fixture-only"),
    );
  });
});
