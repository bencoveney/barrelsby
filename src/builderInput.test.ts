
describe("builderInput module has a", () => {
    describe("createBuilderInput function that", () => {
        it("should include modules as a flat structure", () => {
            // TODO: Test the structure and name for:
            // "."
            // "./module"
            // "./directory1/module"
            // "./directory1/directory2/barrel"
        });
        it("should include modules as a tree structure", () => {
            // TODO: Test the structure and name for:
            // "."
            // "./module"
            // "./directory1/module"
            // "./directory1/directory2/barrel"
        });
        describe("should include flags to differentiate", () => {
            it("modules", () => {
                // TODO: isModule
            });
            it("directories", () => {
                // TODO: isDirectory
            });
        });
        it("should resolve the module name without typescript file extensions: .ts and .tsx", () => {
        });
        it("should resolve the module name without typescript file extensions: .ts and .tsx", () => {
        });
        it("should give each module a safe alphanumeric identifier", () => {
        });
        it("should give each module a suggested indentation level", () => {
            // TODO: Use options.
        });
        describe("should build a quoted path for modules that", () => {
            it("uses the quote character option", () => {
            });
            it("uses the base url option", () => {
            });
            it("can reference modules in the current directory", () => {
            });
            it("can reference references modules in a nested directory", () => {
            });
            it("removes typescript file extensions: .ts and .tsx", () => {
            });
        });
    });
});