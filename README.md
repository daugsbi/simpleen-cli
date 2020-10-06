# Simpleen

Translate i18n locale files with simpleen translation.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/simpleen.svg)](https://npmjs.org/package/simpleen-cli)
[![Downloads/week](https://img.shields.io/npm/dw/simpleen.svg)](https://npmjs.org/package/simpleen-cli)
[![License](https://img.shields.io/npm/l/simpleen.svg)](https://github.com/daugsbi/simpleen-cli/simpleen-cli/blob/master/package.json)

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

The simpleen translation CLI for direct project integrations.
Integrate machine translation in your development workflow to automatically handle the translation of i18n locales.

Currently the CLI is compatible with JSON-based i18n libraries like:

- Format.JS, also known as React-Intl
- i18next
- LinguiJS
- ngx-translate
- Transloco

This can also be combined with the i18n extractor of your i18n library which leads to current translations during the development workflow.

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

To use the cli-tool [https://simpleen.io/signup](signup on simpleen.io) and create an authentication key.
Then you can run `simpleen init` and answer the prompted configuration questions. In the last step you will be asked for your authentication key.

As a next step you should fix/lock the current translations with `simpleen lock`. The locked translations are not getting translated by machine translation.

# Commands

<!-- commands -->

- [`simpleen init config=[FILE]`](#simpleen-init)
- [`simpleen lock config=[FILE]`](#simplen-lock)
- [`simpleen translate config=[FILE] lockFile=[FILE]`](#simpleen-translate)
- [`simpleen help [COMMAND]`](#simpleen-help-command)

## `simpleen init`

Simpleen init let's you configure your i18n project. By default the configuration will be saved at ./simpleen.config.json, this can be changed with the config option.

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

The created configuration file could look like the following. The input_path and output_path are specially handled.
Use a glob to identify input json files. For example `./src/**/en.json` or `./src/en/*.json`.
To construct the output_path you can use the following additional variables:

<!-- prettier-ignore-start -->
| Variable      | Explanation                                                           |
|:--------------|:---------------------------------------------------------------------:|
| $locale       | Lowercased locale, i. e. fr for french                                | 
| $LOCALE       | Uppercased locale, i. e. FR for french                                |
| $FILE         | Filename of matched input file, i. e. src/en/product.json => product  | 
| $FOLDER       | Folder name of matched input file, i. e. src/en/product.json => en    |
| $EXTENSION    | Extension of matched input file, i. e. src/en/product.json => json    |
<!-- prettier-ignore-end -->

```JSON
{
  "source_language": "EN",
  "target_languages": ["DE", "PT-BR"],
  "interpolation": "i18n",
  "input_path": "./public/locales/en/*.json",
  "output_path": "./public/locales/$locale/$FILE.json",
  "auth_key": "AUTHENTICATION_KEY"
}
```

## `simpleen lock`

Locks the current translation results. Locked translations will not be overwritten by simpleen translate.
Lock the translations after manual changes and put it under version control, otherwise they are overwritten with the next run of simpleen translate.
Use this command also after moving/renaming your input files.

```
USAGE
  $ simpleen lock

OPTIONS
  --config=config      [default: ./simpleen.config.json] Defines where the config is located
  --lockFile=lockFile  [default: ./simpleen.lock.json] Defines where the lock file will be created
```

## `simpleen translate`

Translate the project corresponding to the configuration and in compliance with the lock file.

```
USAGE
  $ simpleen translate

OPTIONS
  --config=config      [default: ./simpleen.config.json] Defines where you config file is located
  --lockFile=lockFile  [default: ./simpleen.lock.json] Defines where your lock file is located
```

## `simpleen help [COMMAND]`

Display help for simpleen

```
USAGE
  $ simpleen help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

<!-- commandsstop -->

# Beta

This version is part of an open beta of simpleen translation. As a precaution please make sure that the project is under version control before running `simpleen translate`.
For feedback, discussions, improvements feel free to get in touch with us or tweet and blog about simpleen.
