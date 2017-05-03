# ![Barrelsby Logo](https://github.com/bencoveney/barrelsby/blob/master/img/logo.png?raw=true)

Automatically create TypeScript barrels for your entire code base.

[![npm version](https://badge.fury.io/js/barrelsby.svg)](https://badge.fury.io/js/barrelsby)
[![CircleCI](https://circleci.com/gh/bencoveney/barrelsby.svg?style=svg)](https://circleci.com/gh/bencoveney/barrelsby)
[![codecov](https://codecov.io/gh/bencoveney/barrelsby/branch/master/graph/badge.svg)](https://codecov.io/gh/bencoveney/barrelsby)
[![Greenkeeper badge](https://badges.greenkeeper.io/bencoveney/barrelsby.svg)](https://greenkeeper.io/)

## About Barrels

Barrels are files that rollup exports from several modules into a single convenient module. They
help simplify large blocks of import statements from the top of files.

A barrel file looks like this:

```TypeScript
export * from "./DropDown";
export * from "./TextBox";
export * from "./CheckBox";
export * from "./DateTimePicker";
export * from "./Slider";
```

It can help you go from messy imports like this:

```TypeScript
import {DropDown} from "./src/controls/DropDown";
import {TextBox} from "./src/controls/TextBox";
import {CheckBox} from "./src/controls/CheckBox";
import {DateTimePicker} from "./src/controls/DateTimePicker";
import {Slider} from "./src/controls/Slider";
```

...to something tidier like this:

```TypeScript
import {DropDown, TextBox, CheckBox, DateTimePicker, Slider} from "./src/controls/index";
```

...or even this:

```TypeScript
import * as Controls from "./src/controls/index";
```

### More Reading

* [Angular Glossary](https://angular.io/docs/ts/latest/glossary.html#!#B)
* [TattooCoder Blog](http://tattoocoder.com/angular2-barrels/)

## Usage

Barrelsby accepts a number of options to help refine how your barrels are created. These options
can be configured from the command line or using a configuration file.

### `-c [path]` or `--config [path]`

Specifies the location of the barrelsby configuration file. This file must be a `.json` file. You
can include any of the configuration options using their long name.

### `-d [path]` or `--directory [path]`

Specifies the root directory where barrels will be created from. Uses the current directory by
default.

### `-D` or `--delete`

Deletes any existing barrels encountered by barrelsby. Disabled by default.

### `-e [regex...]` or `--exclude [regex...]`

Excludes any files whose paths match any of the specified regular expressions.

### `-H` or `--help`

Displays help information on the command line arguments that barrelsby accepts.

### `-i [regex...]` or `--include [regex...]`

Only include files whose paths match any of the specified regular expressions.

### `-l [mode]` or `--location [mode]`

The mode that barrelsby should use to determine where which directories to create barrels in.
Defaulted to *top*.

- `top` only creates a barrel in the target directory.
- `below` creates a barrel in every directory just below the target directory.
- `all` creates a barrel in every directory below (and including) the target directory.
- `replace` only creates barrels in directories where one already existed.
- `branch` creates a barrel in every directory that contains other directories.

### `-n [name]` or `--name [name]`

Specifies the name to use for creating new barrels (and identifying old ones). `.ts` wil be
appended if not included in the name. Barrels names will be defaulted to `index.ts`.

### `-s [mode]` or `--structure [mode]`

The structure that barrelsby should create inside the barrels. Defaulted to *flat*.

- `flat` exports modules without any nesting.
- `filesystem` exports modules as a nested structure that matches the filesystem directories.

### `-v` or `--version`

Display the barrelsby version number.

### `-V` or `--verbose`

Display additional debug information.

## TODO List

* 100% test coverage.
* Watch mode.
* Barrel names match directory names.
* Create barrel even if empty (no modules).
* Configurable path seperator for inside barrels?
* Some `tsconfig.json` settings could potentially impact the module resolution (paths, baseUrl, rootDirs).
* Look at `tsconfig.json` to determine which files to load (`--project`).
* Allow custom barrel builder scripts.
* Ability to include/exclude `.tsx` files.
* Prefer globs to regular expressions in include/exclude?
* Distribute @types.

### Code Cleanup
* Ignore non-module files earlier in the process.
* TypeScript strict null checks.
* Some tests could benefit from TestUtilities.
* Some tests could benefit from better assert usage.
* Update "index" terminology to say "barrel" throughout codebase.

## Requirements

Requires node v6.0.0 or greater.
