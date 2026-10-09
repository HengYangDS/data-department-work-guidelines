import assert from "node:assert/strict";
import { test } from "node:test";
import YAML from "yaml";
import { validateCi } from "../../tools/docs/ci.mjs";
import { assertNodeRuntime } from "../../tools/docs/runtime.mjs";
import { github, gitlab, offline, changedGitLab } from "./fixtures.mjs";

test("the repository check rejects an undeclared Node major", () => {
  assert.doesNotThrow(() => assertNodeRuntime("26.10.0"));
  assert.throws(() => assertNodeRuntime("22.23.3"), /Node 26/u);
});

test("native shell jobs select locked process runtimes without changing host npm", () => {
  const pipeline = YAML.parse(gitlab);
  for (const system of ["macos", "windows"]) {
    for (const suffix of ["", ":review"]) {
      const job = pipeline[`docs:verify:${system}${suffix}`];
      assert.equal(
        job.script[0],
        "mise exec --locked -- npm run verify",
        "the selected native runtime must execute the complete verifier",
      );
      assert.equal(
        job.variables.MISE_OVERRIDE_CONFIG_FILENAMES,
        ".config/supply/mise.toml",
        "the supply configuration must be a project input, not a global override",
      );
      assert.ok(
        job.before_script.flat(10).includes("mise install --locked --jobs=1"),
      );
    }
    assert.deepEqual(pipeline[`offline:verify:${system}`].script, [
      "mise exec --locked -- node tools/ci/offline-bundle.mjs acquire-gitlab",
      "mise exec --locked -- node tools/ci/offline-bundle.mjs install",
      "mise exec --locked -- npm run verify",
    ]);
  }
  const changed = structuredClone(pipeline);
  changed["docs:verify:windows"].script = ["npm run verify"];
  assert.throws(
    () => validateCi(github, YAML.stringify(changed), offline),
    /native runtime|platform job/u,
  );
});

test("Windows jobs refresh only their process from the native machine path", () => {
  const pipeline = YAML.parse(gitlab);
  const refresh =
    "$env:PATH = $env:PATH + [IO.Path]::PathSeparator + [Environment]::GetEnvironmentVariable('Path', 'Machine')";
  for (const name of [
    "docs:verify:windows",
    "docs:verify:windows:review",
    "offline:verify:windows",
  ]) {
    const commands = pipeline[name].before_script.flat(10);
    assert.equal(commands[0], refresh, name);
    assert.equal(
      commands[1],
      "Get-Command mise -CommandType Application -ErrorAction Stop | Select-Object -ExpandProperty Source",
      name,
    );
    assert.equal(commands[2], "mise --version", name);
    assert.equal(commands[3], "whoami", name);
    assert.equal(commands[4], "mise install --locked --jobs=1", name);
    for (const change of [
      (job) => {
        job.before_script = commands.slice(1);
      },
      (job) => {
        job.before_script = [
          "$env:PATH = [Environment]::GetEnvironmentVariable('Path', 'Machine') + [IO.Path]::PathSeparator + $env:PATH",
          ...commands.slice(1),
        ];
      },
      (job) => {
        job.before_script = [
          "[Environment]::SetEnvironmentVariable('Path', $env:PATH, 'Machine')",
          ...commands.slice(1),
        ];
      },
    ]) {
      const changed = structuredClone(pipeline);
      change(changed[name]);
      assert.throws(
        () => validateCi(github, YAML.stringify(changed), offline),
        /platform job/u,
        name,
      );
    }
  }
});

test("both providers refuse to skip the dependency audit", () => {
  assert.throws(
    () =>
      validateCi(
        github.replace(
          "run: node tools/docs/cli.mjs audit",
          "run: echo skipped",
        ),
        gitlab,
      ),
    /dependency audit/u,
  );
  assert.throws(
    () =>
      validateCi(
        github,
        gitlab.replace("- node tools/docs/cli.mjs audit", "- echo skipped"),
      ),
    /dependency audit|native source supply/u,
  );
});

test("both source planes preserve complete audit evidence after a failure", () => {
  const workflow = YAML.parse(github);
  const archive = workflow.jobs.verify.steps.find((step) =>
    step.uses?.startsWith("actions/upload-artifact@"),
  );
  assert.ok(archive);
  for (const changed of [undefined, "success()"])
    assert.throws(
      () =>
        validateCi(
          YAML.stringify({
            ...workflow,
            jobs: {
              verify: {
                ...workflow.jobs.verify,
                steps: workflow.jobs.verify.steps.map((step) =>
                  step === archive ? { ...step, if: changed } : step,
                ),
              },
            },
          }),
          gitlab,
          offline,
        ),
      /evidence|cannot skip/u,
    );
  const pipeline = YAML.parse(gitlab);
  pipeline[".docs:verify"].artifacts.when = "on_success";
  assert.throws(
    () => validateCi(github, YAML.stringify(pipeline), offline),
    /evidence/u,
  );
});

test("both providers supply tools without a browser installation", () => {
  assert.doesNotMatch(github, /setup-chrome|PUPPETEER|mermaid/u);
  assert.doesNotMatch(gitlab, /chromium|PUPPETEER|mermaid|apt-get/u);
  assert.equal(validateCi(github, gitlab).verifier, "npm run verify");
});

test("GitLab jobs pin the official multiarch Node image by digest", () => {
  const image = gitlab.match(
    /image: (public\.ecr\.aws\/docker\/library\/node:26-trixie@sha256:[0-9a-f]{64})/u,
  )?.[1];
  assert.ok(image, "GitLab Node image is not digest-pinned");
  assert.equal(gitlab.split(`image: ${image}`).length - 1, 1);
  assert.throws(
    () =>
      validateCi(
        github,
        gitlab.replace(image, "public.ecr.aws/docker/library/node:26-trixie"),
        offline,
      ),
    /digest-pinned/u,
  );
});

test("CI uses the current official Debian base without weakening image pins", () => {
  const declared = YAML.parse(gitlab).default.image;
  assert.equal(validateCi(github, gitlab, offline).verifier, "npm run verify");
  assert.throws(
    () =>
      validateCi(
        github,
        gitlab.replace(declared, declared.replace("-trixie@", "-bookworm@")),
        offline,
      ),
    /digest-pinned/u,
  );
});

test("CI runtime follows the declared stable Node line", () => {
  assert.throws(
    () =>
      validateCi(
        github.replace("node-version: 26", "node-version: 22"),
        gitlab,
      ),
    /Node 26/u,
  );
  assert.throws(
    () =>
      validateCi(github, gitlab.replace("node:26-trixie", "node:22-trixie")),
    /Node 26/u,
  );
});

test("GitLab CI cannot regress to a GitHub-hosted tool download", () => {
  assert.throws(
    () => validateCi(github, gitlab.replace("--gitlab-package", "--download")),
    /GitLab.*supply/u,
  );
});

test("Node setup avoids npm before native package-manager supply", () => {
  for (const source of [github, offline]) {
    const workflow = YAML.parse(source);
    const setup = workflow.jobs.verify.steps.find((step) =>
      step.uses?.startsWith("actions/setup-node@"),
    );
    assert.equal(setup.with["package-manager-cache"], false);
    assert.equal(setup.with["check-latest"], true);
    for (const mutation of [
      () => delete setup.with["package-manager-cache"],
      () => (setup.with["package-manager-cache"] = true),
      () => (setup.with.cache = "npm"),
      () => (setup.with["check-latest"] = false),
      () => (setup.with["node-version-file"] = "unowned.toml"),
    ]) {
      setup.with = {
        "node-version": 26,
        "package-manager-cache": false,
        "check-latest": true,
      };
      mutation();
      const changed = YAML.stringify(workflow);
      assert.throws(
        () =>
          source === github
            ? validateCi(changed, gitlab, offline)
            : validateCi(github, gitlab, changed),
        /Node setup must resolve the latest declared runtime without invoking npm/u,
      );
    }
  }
});

test("package-manager supply cannot bypass native admission or become a second version owner", () => {
  const workflow = YAML.parse(github);
  const install = workflow.jobs.verify.steps.find(
    (step) => step.name === "Install the declared package manager",
  );
  for (const command of [
    "npm install --global npm@11",
    "npm install --global --force npm@12.1.0",
  ]) {
    install.run = command;
    assert.throws(
      () => validateCi(YAML.stringify(workflow), gitlab, offline),
      /package-manager supply/u,
    );
  }
  const native = YAML.parse(gitlab);
  native["docs:verify:macos"].before_script = [
    "npm install --global npm@12.1.0",
    ...native["docs:verify:macos"].before_script,
  ];
  assert.throws(
    () => validateCi(github, YAML.stringify(native), offline),
    /platform job/u,
  );
});

test("both source planes must supply native Vale before verification", () => {
  const workflow = YAML.parse(github);
  workflow.jobs.verify.steps = workflow.jobs.verify.steps.filter(
    (step) => step.run !== "node tools/ci/install-native.mjs vale --download",
  );
  assert.throws(
    () => validateCi(YAML.stringify(workflow), gitlab, offline),
    /supply/u,
  );
  for (const name of [
    ".docs:source-supply",
    ".docs:native-source-supply",
    ".docs:verify",
    "docs:verify:macos",
    "docs:verify:windows",
  ]) {
    assert.throws(
      () =>
        validateCi(
          github,
          changedGitLab(name, (_, job) => {
            job.before_script = job.before_script
              .flat(10)
              .filter(
                (command) =>
                  !command.endsWith(
                    "node tools/ci/install-native.mjs vale --gitlab-package",
                  ),
              );
          }),
          offline,
        ),
      /supply|native|setup|full proof/u,
    );
  }
});

test("native YAML aliases preserve one source-supply list and reject omissions", () => {
  const pipeline = YAML.parse(gitlab);
  const supply = pipeline[".docs:source-supply"].before_script;
  const selectedSupply = pipeline[".docs:native-source-supply"].before_script;
  const windowsSupply = pipeline[".docs:windows-source-supply"].before_script;
  assert.strictEqual(pipeline[".docs:verify"].before_script[1], supply);
  for (const system of ["macos", "windows"]) {
    for (const suffix of ["", ":review"]) {
      assert.strictEqual(
        pipeline[`docs:verify:${system}${suffix}`].before_script,
        system === "windows" ? windowsSupply : selectedSupply,
      );
    }
  }
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
  for (const change of [
    (owner) => owner.before_script.splice(2, 1),
    (owner) => (owner.script = ["npm run verify"]),
  ]) {
    assert.throws(
      () =>
        validateCi(
          github,
          changedGitLab(".docs:source-supply", (_, owner) => change(owner)),
          offline,
        ),
      /native source supply/u,
    );
  }
  const runtime = pipeline[".docs:native-runtime"];
  for (const system of ["macos", "windows"]) {
    for (const suffix of ["", ":review"]) {
      assert.strictEqual(
        pipeline[`docs:verify:${system}${suffix}`].variables,
        runtime.variables,
      );
    }
    assert.strictEqual(
      pipeline[`offline:verify:${system}`].before_script,
      system === "windows"
        ? pipeline[".docs:windows-runtime"].before_script
        : runtime.before_script,
    );
  }
});
