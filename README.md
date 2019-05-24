# i18n-typedef

This small library allows to generate TypeScript definition file from multiple yaml translation files.

[![Build Status](https://travis-ci.com/ericmatte/i18n-typedef.svg?branch=master)](https://travis-ci.com/ericmatte/i18n-typedef)

## Install

```
yarn add -D i18n-typedef
```

## Usage

### CLI

#### Generate a single I18n.d.ts file:

```
yarn run i18n-typedef generate <directories...> -o <outputDirectory>
```

#### Watch mode:

```
yarn run i18n-typedef watch <directories...> -o <outputDirectory>
```

### Within an application

```
const i18nDirectories = [];
const outputDirectory = __dirname;

new I18nYamlDefinitions(i18nDirectories, outputDirectory).generateDefinitions()
```

---

PRs and issues are welcome.
