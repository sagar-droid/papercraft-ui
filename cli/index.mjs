#!/usr/bin/env node
// Papercraft UI CLI — copies component source into your project, shadcn-style.
// Zero dependencies on purpose: it runs via `npx papercraft-ui` in any project.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY = JSON.parse(readFileSync(join(PKG_ROOT, "registry.json"), "utf8")).components;
const CONFIG_FILE = "papercraft.json";
const BASE_DEPS = ["clsx", "tailwind-merge", "class-variance-authority"];

// Aliases the registry source is written against; rewritten to the user's aliases on copy.
const SOURCE_ALIASES = { utils: "@/lib/utils", ui: "@/components/ui" };

const CSS_CANDIDATES = [
  "src/app/globals.css",
  "app/globals.css",
  "src/styles/globals.css",
  "styles/globals.css",
  "src/index.css",
  "src/main.css",
  "src/App.css",
  "src/global.css",
  "app/app.css",
];

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
};

const HELP = `
${c.bold("papercraft-ui")} — tactile paper components for React + Tailwind v4

Usage
  npx papercraft-ui init              Set up tokens, the cn() helper and papercraft.json
  npx papercraft-ui add <names...>    Copy components into your project
  npx papercraft-ui add --all         Copy every component
  npx papercraft-ui list              Show available components

Options
  -y, --yes          Accept defaults, no prompts
  -o, --overwrite    Replace files that already exist
      --no-install   Skip installing npm dependencies
      --cwd <dir>    Run against another directory
  -h, --help         Show this help
`;

// ---------------------------------------------------------------- helpers

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function writeFile(path, contents) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
}

function detectPackageManager(cwd) {
  if (existsSync(join(cwd, "bun.lockb")) || existsSync(join(cwd, "bun.lock"))) return "bun";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  const agent = process.env.npm_config_user_agent ?? "";
  for (const pm of ["pnpm", "yarn", "bun"]) if (agent.startsWith(pm)) return pm;
  return "npm";
}

function installDeps(cwd, deps, opts) {
  const pkg = readJson(join(cwd, "package.json")) ?? {};
  const installed = { ...pkg.dependencies, ...pkg.devDependencies };
  const missing = [...new Set(deps)].filter((d) => !installed[d]);
  if (missing.length === 0) return;

  const pm = detectPackageManager(cwd);
  const cmd = `${pm} ${pm === "npm" ? "install" : "add"} ${missing.join(" ")}`;
  if (!opts.install) {
    console.log(c.yellow(`\nSkipped install. Run: ${cmd}`));
    return;
  }
  console.log(c.dim(`\n$ ${cmd}`));
  const result = spawnSync(pm, [pm === "npm" ? "install" : "add", ...missing], {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    console.error(c.red(`Install failed. Run it yourself: ${cmd}`));
    process.exitCode = 1;
  }
}

async function ask(rl, question, fallback, opts) {
  if (opts.yes || !rl) return fallback;
  const answer = (await rl.question(`${question} ${c.dim(`(${fallback})`)} `)).trim();
  return answer || fallback;
}

/** Turn a filesystem path under src/ (or the root) into the "@/..." alias used by default templates. */
function toAlias(path, hasSrc) {
  const base = path.replace(/\.(tsx?|jsx?)$/, "").replace(/\\/g, "/");
  const stripped = hasSrc ? base.replace(/^src\//, "") : base;
  return `@/${stripped}`;
}

function loadConfig(cwd) {
  const config = readJson(join(cwd, CONFIG_FILE));
  if (!config) {
    console.error(c.red(`No ${CONFIG_FILE} found. Run \`npx papercraft-ui init\` first.`));
    process.exit(1);
  }
  return config;
}

// ---------------------------------------------------------------- commands

async function init(cwd, opts) {
  if (!existsSync(join(cwd, "package.json"))) {
    console.error(c.red("No package.json here. Run init from your project root (or pass --cwd)."));
    process.exit(1);
  }

  const hasSrc = existsSync(join(cwd, "src"));
  const prefix = hasSrc ? "src/" : "";
  const mainCss = CSS_CANDIDATES.find((p) => existsSync(join(cwd, p)));
  const rl = opts.yes || !process.stdin.isTTY ? null : createInterface({ input: process.stdin, output: process.stdout });

  const uiDir = await ask(rl, "Where should components go?", `${prefix}components/ui`, opts);
  const utilsFile = await ask(rl, "Where should the cn() helper go?", `${prefix}lib/utils.ts`, opts);
  const cssFile = await ask(
    rl,
    "Where should the Papercraft tokens stylesheet go?",
    mainCss ? join(dirname(mainCss), "papercraft.css") : `${prefix}styles/papercraft.css`,
    opts,
  );
  const uiAlias = await ask(rl, "Import alias for components?", toAlias(uiDir, hasSrc), opts);
  const utilsAlias = await ask(rl, "Import alias for utils?", toAlias(utilsFile, hasSrc), opts);
  rl?.close();

  const config = {
    css: cssFile,
    paths: { ui: uiDir, utils: utilsFile },
    aliases: { ui: uiAlias, utils: utilsAlias },
  };

  writeFile(join(cwd, CONFIG_FILE), JSON.stringify(config, null, 2) + "\n");
  console.log(`${c.green("✔")} ${CONFIG_FILE}`);

  const utilsTarget = join(cwd, utilsFile);
  if (existsSync(utilsTarget) && !opts.overwrite) {
    console.log(c.yellow(`• ${utilsFile} exists — make sure its cn() registers Papercraft's shadow/radius tokens (see README).`));
  } else {
    writeFile(utilsTarget, readFileSync(join(PKG_ROOT, "src/lib/utils.ts"), "utf8"));
    console.log(`${c.green("✔")} ${utilsFile}`);
  }

  const cssTarget = join(cwd, cssFile);
  if (existsSync(cssTarget) && !opts.overwrite) {
    console.log(c.yellow(`• ${cssFile} exists — skipped (use --overwrite to replace).`));
  } else {
    writeFile(cssTarget, readFileSync(join(PKG_ROOT, "src/styles/papercraft.css"), "utf8"));
    console.log(`${c.green("✔")} ${cssFile}`);
  }

  linkStylesheet(cwd, mainCss, cssFile);
  installDeps(cwd, BASE_DEPS, opts);

  console.log(`\n${c.green("Ready.")} Add components with ${c.bold("npx papercraft-ui add button card")}`);
}

/** Insert `@import "./papercraft.css";` right after the Tailwind import in the app's main stylesheet. */
function linkStylesheet(cwd, mainCss, cssFile) {
  const manual = `Add this line after \`@import "tailwindcss";\` in your main CSS file:\n  @import "./${cssFile}";`;
  if (!mainCss) {
    console.log(c.yellow(`• Couldn't find your main CSS file. ${manual}`));
    return;
  }
  const mainPath = join(cwd, mainCss);
  let rel = relative(dirname(mainPath), join(cwd, cssFile)).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;

  const source = readFileSync(mainPath, "utf8");
  if (source.includes(rel) || source.includes("papercraft")) {
    console.log(c.dim(`• ${mainCss} already imports Papercraft`));
    return;
  }
  const tailwindImport = /@import\s+["']tailwindcss["'][^;]*;/;
  if (!tailwindImport.test(source)) {
    console.log(c.yellow(`• ${mainCss} has no \`@import "tailwindcss";\` (Tailwind v4 is required). ${manual}`));
    return;
  }
  writeFileSync(mainPath, source.replace(tailwindImport, (m) => `${m}\n@import "${rel}";`));
  console.log(`${c.green("✔")} ${mainCss} ${c.dim(`(imports ${rel})`)}`);
}

function resolveComponents(names) {
  const unknown = names.filter((n) => !REGISTRY[n]);
  if (unknown.length) {
    console.error(c.red(`Unknown component(s): ${unknown.join(", ")}`));
    console.error(`Run ${c.bold("npx papercraft-ui list")} to see what's available.`);
    process.exit(1);
  }
  // Walk registryDependencies so e.g. a future `dialog` pulls in `button`.
  const seen = new Set();
  const visit = (name) => {
    if (seen.has(name)) return;
    seen.add(name);
    for (const dep of REGISTRY[name].registryDependencies ?? []) visit(dep);
  };
  names.forEach(visit);
  return [...seen];
}

function add(cwd, names, opts) {
  const config = loadConfig(cwd);
  if (opts.all) names = Object.keys(REGISTRY);
  if (names.length === 0) {
    console.error(c.red("Name at least one component, e.g. `npx papercraft-ui add button`, or pass --all."));
    process.exit(1);
  }

  const deps = [...BASE_DEPS];
  for (const name of resolveComponents(names)) {
    const entry = REGISTRY[name];
    deps.push(...(entry.dependencies ?? []));
    for (const file of entry.files) {
      const target = join(cwd, config.paths.ui, file);
      const shown = relative(cwd, target);
      if (existsSync(target) && !opts.overwrite) {
        console.log(c.yellow(`• ${shown} exists — skipped (use --overwrite to replace)`));
        continue;
      }
      const source = readFileSync(join(PKG_ROOT, "src/components/ui", file), "utf8")
        .replaceAll(`"${SOURCE_ALIASES.utils}"`, `"${config.aliases.utils}"`)
        .replaceAll(`"${SOURCE_ALIASES.ui}/`, `"${config.aliases.ui}/`);
      writeFile(target, source);
      console.log(`${c.green("✔")} ${shown}`);
    }
  }

  installDeps(cwd, deps, opts);
}

function list() {
  const width = Math.max(...Object.keys(REGISTRY).map((n) => n.length));
  console.log(c.bold("\nAvailable components\n"));
  for (const [name, entry] of Object.entries(REGISTRY)) {
    console.log(`  ${name.padEnd(width)}  ${c.dim(entry.description ?? "")}`);
  }
  console.log();
}

// ---------------------------------------------------------------- main

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    yes: { type: "boolean", short: "y", default: false },
    overwrite: { type: "boolean", short: "o", default: false },
    all: { type: "boolean", short: "a", default: false },
    install: { type: "boolean", default: true },
    "no-install": { type: "boolean", default: false },
    cwd: { type: "string" },
    help: { type: "boolean", short: "h", default: false },
  },
});

const opts = { ...values, install: values.install && !values["no-install"] };
const cwd = resolve(values.cwd ?? process.cwd());
const [command, ...rest] = positionals;

switch (command) {
  case "init":
    await init(cwd, opts);
    break;
  case "add":
    add(cwd, rest, opts);
    break;
  case "list":
  case "ls":
    list();
    break;
  default:
    console.log(HELP);
    if (command && !values.help) {
      console.error(c.red(`Unknown command: ${command}`));
      process.exitCode = 1;
    }
}
