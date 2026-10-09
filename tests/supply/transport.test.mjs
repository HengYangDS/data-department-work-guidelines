import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import * as packageTransport from "../../tools/ci/gitlab-package.mjs";
import {
  downloadAsset,
  gitlabPackageRequest,
  selectedAsset,
} from "../../tools/ci/install-native.mjs";

test("GitLab package request stays on its own CI API with header-only identity", () => {
  const asset = selectedAsset("lychee", "linux", "arm64");
  const request = gitlabPackageRequest("lychee", asset, {
    CI_API_V4_URL: "https://gitlab.example.test/api/v4",
    CI_PROJECT_ID: "42",
    CI_JOB_TOKEN: "fixture-only",
  });
  assert.equal(
    request.url,
    "https://gitlab.example.test/api/v4/projects/42/packages/generic/lychee/0.24.2/lychee-aarch64-unknown-linux-gnu.tar.gz",
  );
  assert.deepEqual(request.headers, { "JOB-TOKEN": "fixture-only" });
  assert.equal(request.redirect, "error");
  assert.doesNotMatch(request.url, /fixture-only|github\.com/u);
});

test("GitLab package URLs preserve the exact origin and supported API prefix", () => {
  const asset = selectedAsset("lychee", "linux", "arm64");
  for (const api of [
    "http://gitlab.example.test/api/v4",
    "https://gitlab.example.test/team/api/v4/",
  ]) {
    const request = gitlabPackageRequest("lychee", asset, {
      CI_API_V4_URL: api,
      CI_PROJECT_ID: "42",
      CI_JOB_TOKEN: "fixture-only",
    });
    const expected = new URL(api);
    const actual = new URL(request.url);
    assert.equal(actual.origin, expected.origin);
    assert.equal(
      actual.pathname,
      `${expected.pathname.replace(/\/+$/u, "")}/projects/42/packages/generic/lychee/0.24.2/${asset.name}`,
    );
  }
});

test("GitLab package request refuses missing or untrusted CI inputs", () => {
  const asset = selectedAsset("lychee", "linux", "arm64");
  const valid = {
    CI_API_V4_URL: "https://gitlab.example.test/api/v4",
    CI_PROJECT_ID: "42",
    CI_JOB_TOKEN: "fixture-only",
  };
  for (const changed of [
    { CI_API_V4_URL: "" },
    { CI_API_V4_URL: "https://user:pass@gitlab.example.test/api/v4" },
    { CI_API_V4_URL: "https://gitlab.example.test/other" },
    { CI_API_V4_URL: "http://gitlab.example.test//api/v4" },
    { CI_API_V4_URL: "ftp://gitlab.example.test/api/v4" },
    { CI_PROJECT_ID: "42/other" },
    { CI_JOB_TOKEN: "" },
    { CI_JOB_TOKEN: "fixture\u0000only" },
    { CI_JOB_TOKEN: "fixture\u0100only" },
  ]) {
    assert.throws(() =>
      gitlabPackageRequest("lychee", asset, { ...valid, ...changed }),
    );
  }
});

test("authenticated package download refuses redirects before forwarding identity", async (context) => {
  const calls = [];
  let response = new Response("bounded asset");
  context.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, options });
    return response;
  });
  const request = {
    url: "https://fixture.invalid/asset",
    headers: { "JOB-TOKEN": "fixture-only" },
    redirect: "error",
  };
  assert.equal((await downloadAsset(request)).toString(), "bounded asset");
  assert.equal(calls[0].url, request.url);
  assert.deepEqual(calls[0].options.headers, request.headers);
  assert.equal(calls[0].options.redirect, "error");
  assert.doesNotMatch(calls[0].url, /fixture-only/u);
  response = new Response(null, {
    status: 302,
    headers: { Location: "https://fixture.invalid/other" },
  });
  await assert.rejects(downloadAsset(request), /HTTP 302/u);
  assert.equal(calls.length, 2);
});

test("native asset streaming admits the exact size and refuses one extra byte", async (context) => {
  const admitted = Buffer.from("bounded");
  let bytes = admitted;
  const asset = { size: admitted.length };
  const original = Object.assign(
    new Error("fixture-only cancellation failed"),
    {
      code: "ECONNRESET",
    },
  );
  let cancellationFails = false;
  let cancellations = 0;
  context.mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(bytes);
            if (bytes.length === asset.size) controller.close();
          },
          cancel() {
            cancellations++;
            if (cancellationFails) throw original;
          },
        }),
      ),
  );
  for (const authenticated of [false, true]) {
    const request = {
      url: "https://fixture.invalid/asset",
      ...(authenticated
        ? { headers: { "JOB-TOKEN": "fixture-only" }, redirect: "error" }
        : {}),
    };
    bytes = Buffer.concat([admitted, Buffer.from("!")]);
    cancellationFails = false;
    await assert.rejects(downloadAsset(request, asset), /size limit/u);
    cancellationFails = true;
    await assert.rejects(downloadAsset(request, asset), (error) => {
      assert.equal(
        error.message,
        "native tool download exceeds the size limit",
      );
      if (authenticated) {
        assert.notEqual(error.cause, original);
        assert.equal(error.cause.code, "ECONNRESET");
        assert.doesNotMatch(error.cause.message, /fixture-only/u);
        assert.equal(Object.hasOwn(error.cause, "cause"), false);
      } else assert.equal(error.cause, original);
      return true;
    });
    bytes = admitted;
    assert.deepEqual(await downloadAsset(request, asset), admitted);
  }
  assert.equal(cancellations, 4, "each rejected stream is disposed once");
});

test("native transport errors follow the public and authenticated cause boundary", async (context) => {
  const cause = Object.assign(new Error("native transport failed"), {
    code: "ECONNRESET",
  });
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    throw cause;
  });
  for (const authenticated of [false, true]) {
    await assert.rejects(
      downloadAsset({
        url: "https://fixture.invalid/asset",
        ...(authenticated
          ? { headers: { "JOB-TOKEN": "fixture-only" }, redirect: "error" }
          : {}),
      }),
      (error) => {
        assert.equal(error.message, "native tool download failed");
        if (authenticated) {
          assert.notEqual(error.cause, cause);
          assert.equal(error.cause.code, "ECONNRESET");
          assert.doesNotMatch(error.cause.message, /native transport failed/u);
        } else {
          assert.equal(error.cause, cause);
        }
        return true;
      },
    );
  }
  assert.equal(requests, 2, "transport failures do not trigger retries");
});

test("native body-stream and response-disposal errors preserve safe context without exposing authenticated causes", async (context) => {
  const original = Object.assign(
    new Error("fixture-only authenticated body failed"),
    { code: "UND_ERR_BODY_TIMEOUT" },
  );
  let response;
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    return response;
  });
  for (const authenticated of [false, true]) {
    const request = {
      url: "https://fixture.invalid/asset",
      ...(authenticated
        ? { headers: { "JOB-TOKEN": "fixture-only" }, redirect: "error" }
        : {}),
    };
    for (const phase of ["body", "dispose"]) {
      response =
        phase === "body"
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
      await assert.rejects(downloadAsset(request), (error) => {
        assert.equal(
          error.message,
          phase === "body"
            ? "native tool download body failed"
            : "native tool download failed: HTTP 500",
        );
        if (authenticated) {
          assert.notEqual(error.cause, original);
          assert.equal(error.cause.code, "UND_ERR_BODY_TIMEOUT");
          assert.doesNotMatch(error.cause.message, /fixture-only/u);
          assert.equal(Object.hasOwn(error.cause, "cause"), false);
        } else assert.equal(error.cause, original);
        return true;
      });
    }
  }
  assert.equal(
    requests,
    4,
    "body and disposal failures do not trigger retries",
  );
});

test("real authenticated redirects are refused without forwarding identity", async () => {
  const requests = [];
  const server = createServer((request, response) => {
    requests.push({ path: request.url, token: request.headers["job-token"] });
    response.writeHead(302, { Location: "/outside" });
    response.end();
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const request = gitlabPackageRequest("lychee", selectedAsset("lychee"), {
      CI_API_V4_URL: `http://127.0.0.1:${server.address().port}/api/v4`,
      CI_PROJECT_ID: "42",
      CI_JOB_TOKEN: "fixture-only",
    });
    await assert.rejects(downloadAsset(request), (error) => {
      assert.match(error.cause?.message ?? "", /redirect refused/u);
      assert.doesNotMatch(
        `${error.message} ${error.cause?.message}`,
        /fixture-only/u,
      );
      return true;
    });
    assert.equal(requests.length, 1);
    assert.notEqual(requests[0].path, "/outside");
    assert.equal(requests[0].token, "fixture-only");
  } finally {
    server.closeAllConnections();
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test("rejected native downloads await response disposal and retain its failure", async (context) => {
  let response;
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests += 1;
    return response;
  });
  for (const status of [500, 302]) {
    const cause = new Error("native response disposal failed");
    for (const cleanupFailure of [undefined, cause]) {
      requests = 0;
      let disposed = false;
      response = new Response(
        new ReadableStream({
          async cancel() {
            await new Promise((resolve) => setImmediate(resolve));
            disposed = true;
            if (cleanupFailure) throw cleanupFailure;
          },
        }),
        { status },
      );
      await assert.rejects(
        downloadAsset({ url: "https://fixture.invalid/asset" }),
        (error) =>
          error.message === `native tool download failed: HTTP ${status}` &&
          error.cause === cleanupFailure &&
          Object.hasOwn(error, "cause") === (cleanupFailure !== undefined),
      );
      assert.equal(requests, 1);
      assert.equal(disposed, true);
    }
  }
});

test("a rejected live HTTP stream closes before test teardown", async () => {
  let requests = 0;
  const closed = Promise.withResolvers();
  const deadline = new AbortController();
  const server = createServer((request, response) => {
    requests += 1;
    response.on("close", () => closed.resolve(true));
    response.writeHead(500);
    response.write("failed native asset");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await assert.rejects(
      downloadAsset({
        url: `http://127.0.0.1:${server.address().port}/asset`,
      }),
      /native tool download failed: HTTP 500/u,
    );
    assert.equal(
      await Promise.race([
        closed.promise,
        delay(2000, false, { signal: deadline.signal }),
      ]),
      true,
      "rejected response must close before fallback teardown",
    );
    assert.equal(requests, 1);
  } finally {
    deadline.abort();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("download failures share one native cause and privacy boundary", () => {
  assert.equal(typeof packageTransport.downloadFailure, "function");
  const native = Object.assign(new Error("fixture-only private transport"), {
    code: "ECONNRESET",
  });
  const publicFailure = packageTransport.downloadFailure(
    "download failed",
    native,
  );
  assert.equal(publicFailure.message, "download failed");
  assert.equal(publicFailure.cause, native);
  const privateFailure = packageTransport.downloadFailure(
    "download failed",
    native,
    true,
  );
  assert.notEqual(privateFailure.cause, native);
  assert.equal(privateFailure.cause.code, "ECONNRESET");
  assert.equal(
    privateFailure.cause.message,
    "package transport connection reset",
  );
  assert.equal(Object.hasOwn(privateFailure.cause, "cause"), false);
  assert.doesNotMatch(privateFailure.cause.message, /fixture-only/u);
  for (const authenticated of [false, true]) {
    const statusFailure = packageTransport.downloadFailure(
      "download failed: HTTP 500",
      undefined,
      authenticated,
    );
    assert.equal(statusFailure.message, "download failed: HTTP 500");
    assert.equal(Object.hasOwn(statusFailure, "cause"), false);
  }
});
