# Vimtype — Vim Motion & Programming-Based Typing Test Platform

Vimtype is a browser-based typing test that runs inside a real Vim editor. Instead
of copying plain prose, players fix and complete real code blocks (algorithms, data
structures, and common web-dev boilerplate) using Vim motions and editing commands.

## How it works

Each game session shows two panes:

- **Left pane** — your working buffer. It starts as a function or class skeleton
  seeded with errors and misplaced characters, marked with LSP-style underlining
  and sign-column flags.
- **Right pane** — the target code block you're filling in toward, with a caret that
  tracks your position.

The goal is to make the left pane exactly match the right pane as fast as possible.
A session ends when the buffers match and you write the buffer with `:w` from Normal
mode. Scoring weighs the code block's length, the number of seeded errors, and your
completion time, and flags impossibly fast runs as cheating.

## Features

- JavaScript and TypeScript test code blocks
- Configurable lobby: tabs/spaces, indentation width, and (relative) line numbers
- Vim color themes drawn from popular iTerm2 / Neovim configs
- Persistent player preferences and a high-score leaderboard

## Tech

- Real Vim compiled to WebAssembly via [vim.wasm](https://github.com/rhysd/vim.wasm)
  with a canvas renderer
- React + TypeScript front end (React Router, Tailwind CSS, Vite)
- PostgreSQL, Nginx, and a custom lightweight LSP, hosted on AWS EC2

> **Status:** In active development. See [`BRAINSTORM.md`](BRAINSTORM.md) for the
> design rationale and [`KANBAN.md`](KANBAN.md) for current work.
