import { lstatSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import path from "node:path";
import { run } from "../../docs/runtime.mjs";

export function pathExists(target) {
  try {
    lstatSync(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export function npmCliPath({
  platform = process.platform,
  pathValue = process.env.PATH ?? "",
  npmExecPath = process.env.npm_execpath,
} = {}) {
  if (npmExecPath) {
    if (
      path.basename(npmExecPath) !== "npm-cli.js" ||
      !pathExists(npmExecPath) ||
      !lstatSync(npmExecPath).isFile()
    ) {
      throw new Error("native npm execution entrypoint is unavailable");
    }
    return realpathSync(npmExecPath);
  }
  const directories = [
    ...new Set([
      ...pathValue.split(path.delimiter),
      path.dirname(process.execPath),
    ]),
  ].filter(Boolean);
  const launchers =
    platform === "win32" ? ["npm.cmd", "npm.exe", "npm"] : ["npm"];
  for (const directory of directories) {
    let selectedLauncher;
    for (const name of launchers) {
      const launcher = path.join(directory, name);
      if (!pathExists(launcher)) continue;
      const resolved = realpathSync(launcher);
      if (!lstatSync(resolved).isFile()) continue;
      if (path.basename(resolved) === "npm-cli.js") {
        return resolved;
      }
      selectedLauncher = launcher;
      break;
    }
    if (!selectedLauncher) continue;
    for (const candidate of [
      path.join(directory, "node_modules", "npm", "bin", "npm-cli.js"),
      path.join(
        directory,
        "..",
        "lib",
        "node_modules",
        "npm",
        "bin",
        "npm-cli.js",
      ),
    ]) {
      if (pathExists(candidate) && lstatSync(candidate).isFile()) {
        if (
          platform === "win32" &&
          /^\s*SET\s+"NPM_PREFIX_JS=%~dp0\\node_modules\\npm\\bin\\npm-prefix\.js"\s*$/imu.test(
            readFileSync(selectedLauncher, "utf8"),
          )
        ) {
          const prefixCli = path.join(path.dirname(candidate), "npm-prefix.js");
          if (pathExists(prefixCli)) {
            let prefix;
            try {
              prefix = run(process.execPath, [prefixCli], {
                capture: true,
                timeout: 10_000,
              }).trim();
            } catch {
              throw new Error("native Windows npm prefix resolution failed");
            }
            if (!path.isAbsolute(prefix) || /[\r\n]/u.test(prefix)) {
              throw new Error("native Windows npm prefix is invalid");
            }
            const selected = path.join(
              prefix,
              "node_modules",
              "npm",
              "bin",
              "npm-cli.js",
            );
            if (pathExists(selected) && lstatSync(selected).isFile()) {
              return realpathSync(selected);
            }
          }
        }
        return realpathSync(candidate);
      }
    }
    throw new Error(
      "selected npm launcher has no supported JavaScript entrypoint",
    );
  }
  throw new Error("supported npm JavaScript entrypoint is unavailable");
}

export function isolatedNpmEnvironment(
  directory,
  cacheDirectory,
  { offline = true, environment = process.env } = {},
) {
  const userConfig = path.join(directory, "empty-user.npmrc");
  const globalConfig = path.join(directory, "empty-global.npmrc");
  writeFileSync(userConfig, "");
  writeFileSync(globalConfig, "");
  const isolated = Object.fromEntries(
    Object.entries(environment).filter(
      ([key]) =>
        !/^npm_config_/iu.test(key) &&
        !["NPM_TOKEN", "NODE_AUTH_TOKEN"].includes(key),
    ),
  );
  return {
    ...isolated,
    npm_config_force: "false",
    npm_config_userconfig: userConfig,
    npm_config_globalconfig: globalConfig,
    npm_config_cache: cacheDirectory,
    npm_config_offline: String(offline),
    npm_config_audit: "false",
    npm_config_fund: "false",
    npm_config_update_notifier: "false",
  };
}

export function validateLockSupply(lock) {
  if (
    lock?.lockfileVersion !== 3 ||
    !lock.packages ||
    typeof lock.packages !== "object"
  ) {
    throw new Error("offline bundle requires an npm v3 lockfile");
  }
  let count = 0;
  for (const [location, entry] of Object.entries(lock.packages)) {
    if (!location) continue;
    if (!location.startsWith("node_modules/") || !entry) {
      throw new Error(`unsupported offline package location: ${location}`);
    }
    let resolved;
    try {
      resolved = new URL(entry.resolved);
    } catch {
      throw new Error(`missing package source: ${location}`);
    }
    if (
      resolved.protocol !== "https:" ||
      resolved.hostname !== "registry.npmjs.org" ||
      location.includes("..") ||
      location.includes("\\") ||
      resolved.username ||
      resolved.password ||
      resolved.search ||
      resolved.hash ||
      entry.optional ||
      entry.os ||
      entry.cpu ||
      entry.hasInstallScript ||
      !/^sha512-[A-Za-z0-9+/]+={0,2}$/u.test(entry.integrity ?? "")
    ) {
      throw new Error(
        `offline package is not portable public supply: ${location}`,
      );
    }
    count += 1;
  }
  if (!count) throw new Error("offline bundle lockfile has no packages");
  return count;
}

export function boundedNpm(args, { cwd, env, timeout = 150_000 }) {
  return run(process.execPath, [npmCliPath(), ...args], {
    cwd,
    env,
    input: "",
    capture: true,
    rejectStderr: true,
    timeout,
  }).trim();
}
