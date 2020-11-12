# i18n-typedef

This small library allows to generate TypeScript definition file from multiple yaml translation files.

![Tests](https://github.com/ericmatte/i18n-typedef/workflows/Tests/badge.svg?branch=upgrade) ![NPM Package](https://github.com/ericmatte/i18n-typedef/workflows/NPM%20Package/badge.svg)

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
