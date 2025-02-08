
# Cautious Broccoli

![CI](https://github.com/maccalsa/cautious-broccoli/actions/workflows/ci.yml/badge.svg)

![Version](https://img.shields.io/github/package-json/v/maccalsa/cautious-broccoli)


## Template for a Node.js project with TypeScript, Jest, and Prettier

This project is a template for a Node.js project with TypeScript, Jest, and Prettier.

## Features

- TypeScript
- Jest
- Prettier
- Husky
- Commitlint
- Standard Version

## Installation

```bash
npm install
```

## Usage

```bash
npm run test
```

## Contributing

```bash
npm run format
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

This project is created by [@maccals](https://github.com/maccalsa).

## Commit Message

This project uses commitlint to enforce commit message conventions.
the commit message should be in the following format:

```
<type>(<scope>): <subject>
```

with the following types:

- feat: A new feature
- fix: A bug fix
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests
- build: Changes that affect the build system or external dependencies
- ops: Changes to the CI configuration files and scripts
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- merge: Merge branch 'pr-branch' into 'main'

and the scope should be the name of the package affected by the changes.

## Release

