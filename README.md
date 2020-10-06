# Simpleen

Translate i18n locale files with simpleen translation.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/simpleen.svg)](https://npmjs.org/package/simpleen-cli)
[![Downloads/week](https://img.shields.io/npm/dw/simpleen.svg)](https://npmjs.org/package/simpleen-cli)
[![License](https://img.shields.io/npm/l/simpleen.svg)](https://github.com/daugsbi/simpleen-cli/blob/master/package.json)

<!-- toc -->

- [Simpleen](#simpleen)
- [Usage](#usage)
- [Installation](#installation)
- [Commands](#commands)
  - [`simpleen init`](#simpleen-init)
  - [`simpleen lock`](#simpleen-lock)
  - [`simpleen translate`](#simpleen-translate)
  - [`simpleen help [COMMAND]`](#simpleen-help-command)
- [Beta](#beta)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g simpleen
$ simpleen COMMAND
running command...
$ simpleen (-v|--version|version)
simpleen/0.0.1-alpha linux-x64 node-v10.19.0
$ simpleen --help [COMMAND]
USAGE
  $ simpleen COMMAND
...
```

<!-- usagestop -->

# Installation

You can install the CLI globally

```sh-session
$ yarn add -g simpleen
$ simpleen init
$ simpleen translate
```

or locally:

```sh-session
$ yarn add -D simpleen
$ yarn run simpleen init
$ yarn run simpleen lock
$ yarn run simpleen translate
```

To use the cli-tool [signup on simpleen.io](https://simpleen.io/signup) and create an authentication key.
Then you can run `simpleen init` and answer the prompted configuration questions. In the last step you will be asked for your authentication key.

As a next step you should fix/lock the current translations with `simpleen lock`. The locked translations are not getting translated by machine translation.

# Commands

<!-- commands -->

- [`simpleen init config=[FILE]`](#simpleen-init)
- [`simpleen lock config=[FILE]`](#simplen-lock)
- [`simpleen translate config=[FILE] lockFile=[FILE]`](#simpleen-translate)
- [`simpleen help [COMMAND]`](#simpleen-help-command)

## `simpleen init`

Configure your project

```
USAGE
  $ simpleen init

OPTIONS
  --config=config  [default: ./simpleen.config.json] Defines where the config file will be created

EXAMPLE
  $ simpleen init
  // Answer project questions
  Configuration ./simpleen.config.json saved
```

_See code: [src/commands/init.ts](https://github.com/daugsbi/simpleen-cli/blob/master/src/commands/init.ts)_

## `simpleen lock`

Lock the current translation values

```
USAGE
  $ simpleen lock

OPTIONS
  --config=config      [default: ./simpleen.config.json] Defines where the config is located
  --lockFile=lockFile  [default: ./simpleen.lock.json] Defines where the lock file will be created
```

_See code: [src/commands/lock.ts](https://github.com/daugsbi/simpleen-cli/blob/master/src/commands/lock.ts)_

## `simpleen translate`

Translate project

```
USAGE
  $ simpleen translate

OPTIONS
  --config=config      [default: ./simpleen.config.json] Defines where you config file is located
  --lockFile=lockFile  [default: ./simpleen.lock.json] Defines where your lock file is located
```

_See code: [src/commands/translate.ts](https://github.com/daugsbi/simpleen-cli/blob/master/src/commands/translate.ts)_

## `simpleen help [COMMAND]`

display help for simpleen

```
USAGE
  $ simpleen help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

<!-- commandsstop -->

# Beta

This version is part of an open beta of simpleen translation. As a precaution please make sure that the project is under version control before running `simpleen translate`.
For feedback, discussions, improvements feel free to get in touch with us or tweet and blog about simpleen.
