import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import {
  acquireGitHubBundle,
  acquireGitLabBundle,
} from "../../tools/ci/offline/acquire.mjs";
import { assembleBundle } from "../../tools/ci/offline/build.mjs";
import { buildFixture, pathExistsForTest } from "../offline/fixtures.mjs";

test("public downloads retain native causes; authenticated downloads expose only safe categories", async () => {
  for (const [acquire, environment, provider, retainedCause] of [
    [
      acquireGitHubBundle,
      { GITHUB_REPOSITORY: "Example/Repository", DDWG_RELEASE_TAG: "v4.2.0" },
      "GitHub",
      true,
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
      false,
    ],
  ]) {
    await buildFixture(async (inputs) => {
      const built = assembleBundle(inputs);
      writeFileSync(
        path.join(inputs.repository, ".config/release/offline-bundle.json"),
        JSON.stringify(built),
      );
      const native = Object.assign(new Error("native transport failed"), {
        code: "ECONNRESET",
      });
      let requests = 0;
      await assert.rejects(
        acquire({
          repository: inputs.repository,
          environment,
          fetcher: async () => {
            requests++;
            throw native;
          },
        }),
        (error) => {
          assert.equal(
            error.message,
            `${provider} release bundle download failed`,
          );
          if (retainedCause) {
            assert.equal(error.cause, native);
          } else {
            assert.notEqual(error.cause, native);
            assert.equal(error.cause.code, "ECONNRESET");
            assert.doesNotMatch(
              error.cause.message,
              /native transport failed|fixture-only/u,
            );
          }
          return true;
        },
      );
      assert.equal(requests, 1, "transport errors do not cause a retry");
      assert.deepEqual(
        readdirSync(
          path.join(inputs.repository, "build/artifacts/offline-bundle"),
        ),
        [],
      );
    });
  }
});

test("offline body-stream failures retain download context and authenticated classification without output", async () => {
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
    await buildFixture(async (inputs) => {
      const built = assembleBundle(inputs);
      writeFileSync(
        path.join(inputs.repository, ".config/release/offline-bundle.json"),
        JSON.stringify(built),
      );
      for (const phase of ["body", "dispose", "missing", "size-cancel"]) {
        const original = Object.assign(
          new Error("fixture-only authenticated body failed"),
          { code: "ECONNRESET" },
        );
        let requests = 0;
        let cancellations = 0;
        await assert.rejects(
          acquire({
            repository: inputs.repository,
            environment,
            fetcher: async () => {
              requests++;
              if (phase === "missing") return new Response(null);
              if (phase === "size-cancel") {
                const chunk = Buffer.alloc(1024 * 1024, 65);
                return new Response(
                  new ReadableStream({
                    pull(controller) {
                      controller.enqueue(chunk);
                    },
                    cancel() {
                      cancellations++;
                      throw original;
                    },
                  }),
                );
              }
              return phase === "body"
                ? new Response(
                    new ReadableStream({
                      start(controller) {
                        controller.enqueue(Buffer.from("partial bytes"));
                      },
                      pull(controller) {
                        controller.error(original);
                      },
                    }),
                  )
                : new Response(
                    new ReadableStream({
                      cancel() {
                        throw original;
                      },
                    }),
                    { status: 500 },
                  );
            },
          }),
          (error) => {
            assert.equal(
              error.message,
              phase === "size-cancel"
                ? `${provider} release bundle exceeds the size limit`
                : phase === "body"
                  ? `${provider} release bundle download body failed`
                  : phase === "dispose"
                    ? `${provider} release bundle download failed: HTTP 500`
                    : `${provider} release bundle download returned no body`,
            );
            if (phase !== "missing") {
              if (provider === "GitLab") {
                assert.notEqual(error.cause, original);
                assert.equal(error.cause.code, "ECONNRESET");
                assert.doesNotMatch(error.cause.message, /fixture-only/u);
                assert.equal(Object.hasOwn(error.cause, "cause"), false);
              } else assert.equal(error.cause, original);
            }
            return true;
          },
        );
        assert.equal(requests, 1);
        if (phase === "size-cancel") assert.equal(cancellations, 1);
        assert.deepEqual(
          readdirSync(
            path.join(inputs.repository, "build/artifacts/offline-bundle"),
          ),
          [],
        );
        assert.equal(existsSync(inputs.outputPath), true);
      }
    });
  }
});

test("GitHub acquisition uses the exact public asset without a CLI or credential", async () => {
  await buildFixture(async (inputs) => {
    const built = assembleBundle(inputs);
    const recordPath = path.join(
      inputs.repository,
      ".config",
      "release",
      "offline-bundle.json",
    );
    writeFileSync(recordPath, JSON.stringify(built));
    const environment = {
      GITHUB_REPOSITORY: "Example/Repository",
      DDWG_RELEASE_TAG: "v4.2.0",
      GH_TOKEN: "must-not-forward",
    };
    let calls = 0;
    const fetcher = async (url, options) => {
      calls += 1;
      assert.equal(
        url,
        `https://github.com/Example/Repository/releases/download/v4.2.0/${built.fileName}`,
      );
      assert.equal(options.redirect, "follow");
      assert.deepEqual(options.headers, {});
      assert.ok(options.signal instanceof AbortSignal);
      return new Response(readFileSync(inputs.outputPath), { status: 200 });
    };
    const result = await acquireGitHubBundle({
      repository: inputs.repository,
      environment,
      fetcher,
    });
    assert.equal(result.sha256, built.sha256);
    assert.equal(calls, 1);
    assert.equal(
      (
        await acquireGitHubBundle({
          repository: inputs.repository,
          environment,
          fetcher: () => {
            throw new Error("must not download twice");
          },
        })
      ).sha256,
      built.sha256,
    );
    for (const changed of [
      { DDWG_RELEASE_TAG: "v4.1.1" },
      { GITHUB_REPOSITORY: "invalid" },
      { GITHUB_SERVER_URL: "http://github.example.test" },
    ]) {
      await assert.rejects(() =>
        acquireGitHubBundle({
          repository: inputs.repository,
          environment: { ...environment, ...changed },
          fetcher,
        }),
      );
    }
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
    await assert.rejects(() =>
      acquireGitHubBundle({
        repository: inputs.repository,
        environment: {
          GITHUB_REPOSITORY: "Example/Repository",
          DDWG_RELEASE_TAG: "v4.2.0",
        },
        fetcher: async () => new Response("altered", { status: 200 }),
      }),
    );
    assert.equal(pathExistsForTest(target), false);
  });
});

test("public GitHub acquisition fails closed and removes only its failed output", async () => {
  for (const [fetcher, expected] of [
    [async () => new Response("missing", { status: 404 }), /HTTP 404/u],
    [
      async () => new Response(null, { status: 200 }),
      /download returned no body/u,
    ],
    [
      async () => {
        throw new Error("network failed");
      },
      /download failed/u,
    ],
    [
      async () => {
        const chunk = new Uint8Array(1024 * 1024);
        let count = 0;
        return new Response(
          new ReadableStream({
            pull(controller) {
              if (count++ < 513) controller.enqueue(chunk);
              else controller.close();
            },
          }),
        );
      },
      /exceeds the size limit/u,
    ],
  ]) {
    await buildFixture(async (inputs) => {
      const built = assembleBundle(inputs);
      writeFileSync(
        path.join(
          inputs.repository,
          ".config",
          "release",
          "offline-bundle.json",
        ),
        JSON.stringify(built),
      );
      await assert.rejects(
        () =>
          acquireGitHubBundle({
            repository: inputs.repository,
            environment: {
              GITHUB_REPOSITORY: "Example/Repository",
              DDWG_RELEASE_TAG: "v4.2.0",
            },
            fetcher,
          }),
        expected,
      );
      assert.equal(
        existsSync(
          path.join(
            inputs.repository,
            "build",
            "artifacts",
            "offline-bundle",
            built.fileName,
          ),
        ),
        false,
      );
      assert.equal(existsSync(inputs.outputPath), true);
    });
  }
});
