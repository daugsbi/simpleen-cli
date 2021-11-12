# Simpleen

Translate i18n locale files with Simpleen

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/simpleen.svg)](https://npmjs.org/package/simpleen)
[![Downloads/week](https://img.shields.io/npm/dw/simpleen.svg)](https://npmjs.org/package/simpleen)
[![License](https://img.shields.io/npm/l/simpleen.svg)](https://github.com/daugsbi/simpleen-cli/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Installation](#installation)
- [Commands](#commands)
  - [`simpleen init`](#simpleen-init)
    - [Add glossary manually](#add-glossary-manually)
  - [[Deprecated - use simpleen upload] `simpleen lock`](#deprecated---use-simpleen-upload-simpleen-lock)
  - [`simpleen translate`](#simpleen-translate)
  - [`simpleen upload`](#simpleen-upload)
  - [`simpleen usage`](#simpleen-usage)
  - [`simpleen help [COMMAND]`](#simpleen-help-command)
- [Version Control](#version-control)
<!-- tocstop -->

# Usage

The Simpleen CLI Tool for direct project integrations.
Integrate machine translation into your development workflow to automatically handle the translation of i18n locales.

Currently the CLI is compatible with JSON-based i18n libraries like:

- Format.JS (react-intl)
- i18next
- LinguiJS
- ngx-translate
- Transloco
- Polyglot.js

This can also be combined with the i18n extractor of your i18n library which leads to continuous translations during the development workflow.

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

To use the CLI Tool [signup on simpleen.io](https://simpleen.io/signup) and create an authentication key.
Then you can run `simpleen init` and answer the prompted configuration questions. In the last step you will be asked for your authentication key.

As a next step you can fix/lock the current translations with `simpleen lock`. The locked translations are not getting translated by machine translation.

# Commands

<!-- commands -->

- [`simpleen init config=[FILE]`](#simpleen-init)
- [`simpleen lock config=[FILE]`](#simplen-lock)
- [`simpleen translate config=[FILE] lockFile=[FILE]`](#simpleen-translate)
- [`simpleen upload config=[FILE]`](#simplen-upload)
- [`simpleen usage config=[FILE]`](#simplen-usage)
- [`simpleen help [COMMAND]`](#simpleen-help-command)

## `simpleen init`

Simpleen init let's you configure your i18n project. By default the configuration will be saved at ./simpleen.config.json. Use the config option to change the path and filename.

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

For the input_path you can use a glob pattern to find multiple translation files if needed. For example `./src/**/en.json` or `./src/en/*.json`.
The output_path can be constructed with additional variables that are replaced as followed:

<!-- prettier-ignore-start -->
| Variable      | Explanation                                                                            |
|:--------------|:---------------------------------------------------------------------------------------|
| $locale       | Lowercase locale, i. e. fr for French                                                  | 
| $LOCALE       | Uppercase locale, i. e. FR for French                                                  |
| $FILE         | Filename of matched translation file, i. e. ./locale/store/product.json => product     | 
| $FOLDER       | Folder name of matched translation file, i. e. ./locale/store/product.json => store    |
| $PATH         | Path to matched translation file, i. e. ./locale/store/product.json => ./locale/store/ |
| $EXTENSION    | Extension of matched translation file, i. e. ./locale/store/product.json => json       |
<!-- prettier-ignore-end -->

The created configuration file could look like this:

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

### Add glossary manually

Add your glossaries in the configuration file (simpleen.config.json) manually.
Use one glossary per target language:

```JSON
{
  "source_language": "EN",
  "target_languages": ["DE", "PT-BR"],
  "interpolation": "i18n",
  "input_path": "./public/locales/en/*.json",
  "output_path": "./public/locales/$locale/$FILE.json",
  "auth_key": "AUTHENTICATION_KEY",
  "glossary": {
    "DE": 100,
    "PT-BR": 103
  }
}
```

You don't need to provide a glossary for each target language if you don't need one. Just skip it

```JSON
{
  "glossary": {
    "DE": 100
  }
}
```

## [Deprecated - use simpleen upload] `simpleen lock`

Locks the current translation results. Locked translations will not be overwritten by `simpleen translate`.
Lock the translations after manual changes and put it under version control, otherwise they are overwritten with the next run of `simpleen translate`.
Use this command also after moving/renaming your translation files.

```
USAGE
  $ simpleen lock

OPTIONS
  --config=config      [default: ./simpleen.config.json] Defines where the config is located
```

## `simpleen translate`

Translate the project corresponding to the configuration and in compliance with the lock file.

```
USAGE
  $ simpleen translate

OPTIONS
  --config=config      [default: ./simpleen.config.json] Defines where you config file is located
```

## `simpleen upload`

Saves the current translation results at simpleen.io. These are used for subsequent translations and are not counted to your quota.
If you have already some parts translated, use this command before `simpleen translate` to save your progress. Also if you have adapted your target files, use this command to sync your changes.

```
USAGE
  $ simpleen upload

OPTIONS
  --config=config      [default: ./simpleen.config.json] Defines where the config is located
```

## `simpleen usage`

Shows the current quota of your account. A segment is one translatable value in your JSON file.

```
USAGE
  $ simpleen usage

OPTIONS
  --config=config      [default: ./simpleen.config.json] Defines where the config is located
```

## `simpleen help [COMMAND]`

Display help for Simpleen.

```
USAGE
  $ simpleen help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

<!-- commandsstop -->

# Version Control

As a precaution please make sure that the project is under version control before running `simpleen translate`.
Feel free to get in touch with us for feedback, discussions, improvements or tweet and blog about Simpleen.
