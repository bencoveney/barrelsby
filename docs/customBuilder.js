module.exports = function(directory, modules, options) {
    const moduleList = modules
        .map(module => `${options.indentation}${module.path}`)
        .join("\n");

    return `In directory:
${options.indentation}${directory.path}

Using modules:
${moduleList}
`;
}