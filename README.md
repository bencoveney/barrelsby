![Barrelsby Logo](https://github.com/bencoveney/barrelsby/blob/master/img/logo.png?raw=true)

# Barrelsby

Automatically create TypeScript barrels for your entire code base.

## About Barrels

Barrels are files that rollup exports from several modules into a single convenient module. They
help simplify large blocks of import statements from the top of files.

A barrel file that looks like this:

```TypeScript
export * from "./DropDown";
export * from "./TextBox";
export * from "./CheckBox";
export * from "./DateTimePicker";
export * from "./Slider";
```

Can help you go from this:

```TypeScript
import {DropDown} from "./src/controls/DropDown";
import {TextBox} from "./src/controls/TextBox";
import {CheckBox} from "./src/controls/CheckBox";
import {DateTimePicker} from "./src/controls/DateTimePicker";
import {Slider} from "./src/controls/Slider";
```

To this:

```TypeScript
import {DropDown, TextBox, CheckBox, DateTimePicker, Slider} from "./src/controls/index";
```

Or this:

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

### `-H` or `--help`

Displays help information on the command line arguments that barrelsby accepts.

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

### `-v` or `--version`

Display the barrelsby version number.

### `-V` or `--verbose`

Display additional debug information.

## TODO
* Barrel nesting options
  * Nested modules
  * Flattened modules
* Barrel names match directory names
* Path seperator
* Exclude regex
  * Modules
  * Directories
