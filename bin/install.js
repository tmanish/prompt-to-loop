#!/usr/bin/env node
'use strict';

/**
 * prompt-to-loop installer
 *
 * Copies the prompt-to-loop skill into a Claude Code skills directory.
 *
 *   npx github:tmanish/prompt-to-loop            # install into ./.claude/skills (project)
 *   npx github:tmanish/prompt-to-loop --global   # install into ~/.claude/skills (user-global)
 *   npx github:tmanish/prompt-to-loop --dir PATH # install into a custom skills directory
 *
 * No dependencies — pure Node (fs.cpSync requires Node >= 16.7).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const SKILL_NAME = 'prompt-to-loop';
const PKG_ROOT = path.resolve(__dirname, '..');
const SKILL_SRC = path.join(PKG_ROOT, SKILL_NAME);

function parseArgs(argv) {
  const opts = { scope: 'project', dir: null, force: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '-g':
      case '--global':
        opts.scope = 'global';
        break;
      case '-p':
      case '--project':
        opts.scope = 'project';
        break;
      case '-d':
      case '--dir':
        opts.dir = argv[++i];
        break;
      case '-f':
      case '--force':
        opts.force = true;
        break;
      case '-h':
      case '--help':
        opts.help = true;
        break;
      default:
        if (arg.startsWith('--dir=')) {
          opts.dir = arg.slice('--dir='.length);
        } else {
          console.error(`Unknown option: ${arg}`);
          opts.help = true;
        }
    }
  }
  return opts;
}

function usage() {
  console.log(`
prompt-to-loop — install the skill into Claude Code

Usage:
  npx github:tmanish/prompt-to-loop [options]

Options:
  -p, --project      Install into ./.claude/skills (default)
  -g, --global       Install into ~/.claude/skills (available in every project)
  -d, --dir <path>   Install into a custom skills directory
  -f, --force        Overwrite an existing install without prompting
  -h, --help         Show this help

After installing, restart Claude Code (or reload the window). Invoke the skill
with /prompt-to-loop, or just ask Claude to build something and it triggers
automatically.
`);
}

function resolveSkillsDir(opts) {
  if (opts.dir) return path.resolve(opts.dir);
  if (opts.scope === 'global') return path.join(os.homedir(), '.claude', 'skills');
  return path.join(process.cwd(), '.claude', 'skills');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    usage();
    process.exit(0);
  }

  if (!fs.existsSync(path.join(SKILL_SRC, 'SKILL.md'))) {
    console.error(`Error: could not find skill source at ${SKILL_SRC}`);
    console.error('This installer must run from the prompt-to-loop package.');
    process.exit(1);
  }

  const skillsDir = resolveSkillsDir(opts);
  const dest = path.join(skillsDir, SKILL_NAME);

  if (fs.existsSync(dest) && !opts.force) {
    console.error(`A skill already exists at:\n  ${dest}\n`);
    console.error('Re-run with --force to overwrite it.');
    process.exit(1);
  }

  fs.mkdirSync(skillsDir, { recursive: true });
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(SKILL_SRC, dest, { recursive: true });

  console.log(`✓ Installed ${SKILL_NAME} to:\n  ${dest}\n`);
  console.log('Next: restart Claude Code, then run /prompt-to-loop or just ask it to build something.');
}

main();
