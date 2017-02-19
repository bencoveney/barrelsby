# Barrelsby
Automatic TypeScript barrels for your entire code base

## Usage

Run Barrelsby with default settings in the current directory:

`barrelsby`

### Directory

Run barrelsby against the `src` directory:

`barrelsby -d src`

`barrelsby --directory src`

### Delete

Delete any existing barrels found while running barrelsby:

`barrelsby -D`

`barrelsby --delete`

### Help

Display help:

`barrelsby -h`

`barrelsby --help`

### Mode

Create a barrel in the top directory:

`barrelsby -m top`

`barrelsby --mode top`

Create a barrel in each directory below the top directory:

`barrelsby -m below`

`barrelsby --mode below`

Create a barrel every directory:

`barrelsby -m all`

`barrelsby --mode all`

Replace the content of existing barrels:

`barrelsby -m replace`

`barrelsby --mode replace`

Create a barrel in any directory that contains other directories:

`barrelsby -m branch`

`barrelsby --mode branch`

### Name

Create barrel files with a specified name (e.g. `barrel.ts`):

`barrelsby -n barrel`

`barrelsby --name barrel`

### Version

Display the barrelsby version number:

`barrelsby -v`

`barrelsby --version`

### Verbose

Display additional debug information:

`barrelsby -V`

`barrelsby --verbose`

## TODO
* Barrel nesting options
  * Nested modules
  * Flattened modules
* Barrel names match directory names
* Path seperator
* Exclude regex
  * Modules
  * Directories
* Config file
