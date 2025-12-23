# Contributing

### **Table of Contents**

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Standards and Guidelines](#standards-and-guidelines)
  - [Theme Guidelines](#theme-guidelines)
  - [Language Guidelines](#language-guidelines)
  - [Quote Guidelines](#quote-guidelines)
  - [Layout Guidelines](#layout-guidelines)
- [Questions](#questions)

## Getting Started

When contributing to Vimtype, it's good to know our best practices, tips, and tricks. First, Vimtype is written in ~~JavaScript~~ TypeScript, CSS, and HTML (in order of language usage within the project); thus, we assume you are comfortable with these languages or have basic knowledge of them. Our backend is in NodeJS and we use MongoDB to store our user data. Firebase is used for authentication. Redis is used to store ephemeral data (daily leaderboards, jobs via BullMQ, OAuth state parameters). Furthermore, we use `oxfmt` to format our code.

## How to Contribute

We have two separate contribution guides based on what you're looking to contribute. If you're simply looking to help with small documentation tweaks that do not require a local setup, refer to [CONTRIBUTING_BASIC.md](/docs/CONTRIBUTING_BASIC.md).

If you're looking to make deeper code changes that affect functionality, or will require screenshots of the changes, please refer to [CONTRIBUTING_ADVANCED.md](/docs/CONTRIBUTING_ADVANCED.md).

## Standards and Guidelines

Below is a set of general guidelines for different types of changes.

### Pull Request Naming Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our pull request titles (and commit messages on the master branch) and also include the author name at the end inside parenthesis.  Please follow the guidelines below when naming pull requests.


For types, we use the following:

- `feat`: A new feature
- `impr`: An improvement to an existing feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature, but makes the code easier to read, understand, or improve
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies (example scopes: vite, tsup-node, npm)
- `ci`: Changes to our CI configuration files and scripts (example scopes: GitHub Workflows)
- `revert`: Reverts a previous commit
- `chore`: Other changes that don't apply to any of the above

#### Examples

- `feat: add new feature (@github_username)`
- `impr(frontend): adjust caret animation (@username)`
- `fix(leaderboard): show user rank correctly (@user1, @user2, @user3)`

### Content Contributions

Vimtype does not accept direct contributions for themes, languages, quotes, fonts, or layouts. Those assets are managed upstream in Monkeytype and periodically synced into Vimtype. If you want to contribute to those areas, please contribute to Monkeytype instead.

## Questions

If you have any questions, comments, concerns, or problems, open an issue or discussion in this repository and a contributor will be happy to assist you.
