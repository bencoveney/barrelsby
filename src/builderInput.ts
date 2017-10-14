
// Builder input describing a module.
export interface ModuleInput {
    // The module name.
    name: string;

    // A unique typescript-safe identifier.
    identifier: string;
    // The resolved path to the module including quotes.
    quotedPath: string;

    // Indentation level.
    indent: string;
}

// Builder input describing a directory.
export interface DirectoryInput {
    // The name of the directory.
    name: string;

    // The modules and files in the directory, sorted alphabetically.
    content: Array<ModuleInput | DirectoryInput>;
    // The modules in the directory, sorted alphabetically.
    modules: ModuleInput[];
    // The directories in the directory, sorted alphabetically.
    directories: DirectoryInput[];

    // The smaller indentation level (e.g. for enclosing braces).
    indentSmall: string;
    // The larger indentation level (e.g. for brace content).
    indentLarge: string;
}

// Input for a builder template.
export interface BuilderInput {
    // All modules as a flat array.
    modules: ModuleInput[];
    // Modules arranged in a directory structure.
    tree: DirectoryInput;
}
