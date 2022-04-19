# Changelog

All notable changes to the simpleen-cli will be documented in this file.
Simpleen is a [translation platform for i18n projects](https://simpleen.io/).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2022-04-19

- Add Markdown support for translation command
- Upload of Markdown not supported yet
- Upgrade depencies

## [0.5.1] - 2021-11-12

- Use glossary for CLI (manual configuration)

## [0.4.2] - 2021-03-17

- Add sprintf interpolation to init, i.e. %s and %d

## [0.4.1] - 2021-02-17

- Add new dataformats to translate .yml,.yaml,.po and .json
- Fix error in init in config - results in invalid interpolations
- Ignore lock file in translate command
- Add $PATH variable in output_path
- Upgrade dependencies

## [0.3.0] - 2021-02-01

- Add new languages supported by google translate

## [0.2.0] - 2021-01-26

- New options for interpolations, run simpleen init to use them

## [0.1.1] - 2021-01-25

- Readme updated
- Add info if update of CLI is available
- Fix command description of usage
- Add info in translate command if limit is reached

## [0.1.0] - 2021-01-22

### New features

- simpleen usage shows the current quota
- simpleen upload saves adapted translations
- [deprecated] simpleen lock - use simpleen upload instead
- [fix] Catch error globally in BaseCommand

## [0.0.1] - 2020-10-06

### Added to the first release

- simpleen init with prompt to configure project
- simpleen lock to lock current/adapted translations
- simpleen translate to translate configured project
