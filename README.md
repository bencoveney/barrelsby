# Barrelsby
Automatic TypeScript barrels for your entire code base

## Usage

Run Barrelsby with default settings:

`barrelsby`

### Directory

Run barrelsby against the `src` directory:

`barrelsby -d src`

`barrelsby -directory src`

### Delete

Delete any existing barrels found while running barrelsby:

`barrelsby -D`

`barrelsby -delete`

## TODO
* Crawl options
  * From current directory
  * From specified directory
* Index creation options
  * Every directory
  * Top level directory
  * N directories deep
  * Directories containing index.ts
* Barrel nesting options
  * Nested modules
  * Flattened modules
* Delete any existing indexes
* Name of barrel files
* Path seperator
