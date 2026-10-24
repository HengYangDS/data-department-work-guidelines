package ci

// Retained DDWG offline verification: the product keeps release acquisition and
// cold payload with this repository until a public offline replacement passes exact
// release acceptance (native-document-quality 2.45). It reuses the bound parameters.
let ci = _inputs.ci
let candidate = "$\(ci.gitlab.offline_candidate_variable)"
let protectedCandidate = "\(candidate) && $CI_COMMIT_REF_PROTECTED == \"true\" && ($CI_COMMIT_BRANCH == \"\(ci.accepted_branch)\" || $CI_COMMIT_BRANCH == \"\(ci.release_branch)\") && ($CI_PIPELINE_SOURCE == \"api\" || $CI_PIPELINE_SOURCE == \"web\")"
let install = "mise install --locked --jobs=1"
let runners = ci.gitlab.runners

compiled: providers: gitlab: {
	".offline:verify": {
		stage:         "verify"
		timeout:       "25m"
		interruptible: true
		rules: [
			{if: protectedCandidate},
			{if: candidate, when: "never"},
			{if: "$CI_COMMIT_TAG =~ /^v[^\\/]*$/ && $CI_PIPELINE_SOURCE == \"web\""},
			{if: "$CI_COMMIT_TAG =~ /^v[^\\/]*$/ && $CI_PIPELINE_SOURCE == \"api\""},
		]
		variables: {GIT_DEPTH: "0"} & ci.gitlab.variables
		before_script: [for command in runners.linux.preparation {command}, install]
		script: [
			"mise exec --locked -- node tools/ci/offline-bundle.mjs acquire-gitlab",
			"mise exec --locked -- node tools/ci/offline-bundle.mjs install",
			"mise exec --locked -- ethos prove --host --execute --full --json",
		]
	}
	"offline:verify:linux": {
		extends: ".offline:verify"
		image:   runners.linux.image
		tags:    runners.linux.protected_tags
	}
	"offline:verify:macos": {
		extends: ".offline:verify"
		before_script: [install]
		tags: runners.macos.protected_tags
	}
	"offline:verify:windows": {
		extends:        ".offline:verify"
		resource_group: runners.windows.resource_group
		before_script: [for command in runners.windows.preparation {command}, install]
		tags: runners.windows.protected_tags
	}
}
