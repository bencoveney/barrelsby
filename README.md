# ![Barrelsby Logo](https://github.com/bencoveney/barrelsby/blob/master/img/logo.png?raw=true)

Automatically create TypeScript barrels for your entire code base.

[![npm version](https://badge.fury.io/js/barrelsby.svg)](https://badge.fury.io/js/barrelsby)
[![CircleCI](https://circleci.com/gh/bencoveney/barrelsby.svg?style=shield)](https://circleci.com/gh/bencoveney/barrelsby)
[![codecov](https://codecov.io/gh/bencoveney/barrelsby/branch/master/graph/badge.svg)](https://codecov.io/gh/bencoveney/barrelsby)
[![Greenkeeper badge](https://badges.greenkeeper.io/bencoveney/barrelsby.svg)](https://greenkeeper.io/)

## About Barrels

Barrels are files that rollup exports from several modules into a single convenient module
typically named `index.ts`. They tend to help simplify large blocks of import statements at the top
of files and help to group up related functionality.

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
import {DropDown, TextBox, CheckBox, DateTimePicker, Slider} from "./src/controls";
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

#### `flat`

Exports modules without any nesting.

```TypeScript
export * from "./barrel";
export * from "./index";
export * from "./directory2/script";
export * from "./directory2/directory4/deeplyNested";
export * from "./directory3/program";
```

#### `filesystem`

Exports modules as a nested structure that matches the file system directories.

```TypeScript
import * as barrelts from "./barrel";
import * as directory2directory4deeplyNestedts from "./directory2/directory4/deeplyNested";
import * as directory2scriptts from "./directory2/script";
import * as directory3programts from "./directory3/program";
import * as indexts from "./index";
export {barrelts as barrel};
export const directory2 = {
  directory4: {
    deeplyNested: directory2directory4deeplyNestedts,
  },
  script: directory2scriptts,
};
export const directory3 = {
  program: directory3programts,
};
export {indexts as index};
```

### `-q` or `--singleQuotes`

Use 'single quotes' in the generated barrel files instead of the default "double quotes".


### `-v` or `--version`

Display the barrelsby version number.

### `-V` or `--verbose`

Display additional debug information.

## Requirements

Requires node v6.0.0 or greater for ES6 syntax.
