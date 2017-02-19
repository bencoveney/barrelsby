#! /usr/bin/env node

import * as fs from "fs";
import * as path from "path";

import * as Yargs from "yargs";

var argv = Yargs
	.usage("Usage: barrelsby [options]")
	.example("barrelsby", "Run barrelsby")

	.string("d")
	.alias("d", "directory")
	.nargs("d", 1)
	.describe("d", "The directory to create barrels for.")
	.default("d", "./")

	.boolean("D")
	.alias("D", "delete")
	.describe("D", "Delete existing index files.")
	.default("D", false)

	.string("m")
	.alias("m", "mode")
	.describe("m", "The mode for creation of index files")
	.choices("m", ["top", "below", "all", "replace", "branch"])
	.default("m", "top")

	.help("h")
	.alias("h", "help")
	.default("h", false)

	.version()
	.alias("v", "version")
	.default("v", false)

	.boolean("V")
	.alias("V", "verbose")
	.describe("V", "Display additional logging information")
	.default("D", false)

	.argv;

const indexName: string = "index.ts";
const rootPath: string = path.resolve(argv.directory);
const logger: (message: string) => void = argv.verbose ? console.log : (message: string) => {};

/** A location in the file tree. */
interface Location {
	/** The full path of the location including the name. */
	path: string;
	/** The local name of the location. */
	name: string;
}

/** A directory in the file tree. */
interface Directory extends Location {
	/** The directories within the directory. */
	directories: Directory[],
	/** The files within the directory. */
	files: Location[]
	/** The index within the directory if one exists. */
	index?: Location;
};

/** Build directory information recursively. */
function buildTree(directory: string): Directory {
	logger(`Building directory tree for ${directory}`);
	const names = fs.readdirSync(directory);
	const result: Directory = {
		path: directory,
		name: path.basename(directory),
		directories: [],
		files: []
	};
	names.forEach((name: string) => {
		const fullPath = path.join(directory, name);
		if (fs.statSync(fullPath).isDirectory()) {
			result.directories.push(buildTree(fullPath));
		} else {
			const file = {
				path: fullPath,
				name
			};
			result.files.push(file);
			if (file.name === indexName) {
				logger(`Found existing index @ ${fullPath}`);
				result.index = file;
			}
		}
	});
	return result;
}

/** Walk an entire directory tree recursively. */
function walkTree(directory: Directory, callback: (directory: Directory) => void) {
	callback(directory);
	for(const name of Object.keys(directory.directories)) {
		walkTree(directory.directories[name], callback);
	}
}

// Build the directory tree.
const rootTree = buildTree(rootPath);

// Work out which directories should have index files.
let destinations: Directory[];
switch(argv.mode) {
	case "top":
	default:
		destinations = [rootTree];
		break;
	case "below":
		destinations = rootTree.directories
		break;
	case "all":
		destinations = [];
		walkTree(rootTree, (directory: Directory) => {
			destinations.push(directory);
		});
		break;
	case "replace":
		destinations = [];
		walkTree(rootTree, (directory: Directory) => {
			if (directory.files.some((location: Location) => location.name === indexName)) {
				destinations.push(directory);
			}
		});
		break;
	case "branch":
		destinations = [];
		walkTree(rootTree, (directory: Directory) => {
			if (directory.directories.length > 0) {
				destinations.push(directory);
			}
		});
		break;
}

// Sort by length. This means barrels will be created deepest first.
destinations = destinations.sort((a: Directory, b: Directory) => {
	return b.path.length - a.path.length
});

logger("Destinations:")
destinations.forEach((destination) => logger(destination.path));

// Delete any existing indexes.
if (argv.delete) {
	walkTree(rootTree, (directory: Directory) => {
		directory.files
			.filter((file: Location) => {
				return file.name === indexName;
			})
			.forEach((file: Location) => {
				logger(`Deleting existing index @ ${file.path}`);
				// Delete barrel file and clean up tree model.
				fs.unlinkSync(file.path);
				directory.files.splice(directory.files.indexOf(file), 1);
				directory.index = undefined;
			});
	});
}

// Get any typescript modules contained at any depth in the current directory.
function getModules(directory: Directory): Location[] {
	logger(`Getting modules @ ${directory.path}`);
	if (directory.index) {
		// If theres an index then use that as it *should* contain descendant modules.
		logger(`Found existing index @ ${directory.index.path}`);
		return [directory.index];
	}
	let files: Location[] = [].concat(directory.files);
	directory.directories.forEach((directory: Directory) => {
		// Recurse.
		files.push(...getModules(directory));
	});
	// Only return files that look like TypeScript modules.
	return files.filter((file: Location) => file.name.match(/\.ts$/m));
}

// Build a barrel for the specified directory.
function buildBarrel(directory: Directory) {
	logger(`Building barrel @ ${directory.path}`);
	const barrelContent = getModules(directory).reduce(
		(previous: string, current: Location) => {
			// Get the route from the current directory to the module.
			const relativePath = path.relative(directory.path, current.path);
			// Get the route and ensure it's relative
			let directoryPath = path.dirname(relativePath);
			if (directoryPath !== ".") {
				directoryPath = `.${path.sep}${directoryPath}`;
			}
			// Strip off the .ts from the file name.
			const fileName = path.basename(relativePath,".ts");
			// Build the final path string. Use posix-style seperators.
			let location = `${directoryPath}${path.sep}${fileName}`;
			location = location.replace(/\\+/g, "/");
			logger(`Including path ${location}`);
			return previous += `export * from "${location}";
`;
		},
		""
	);
	const indexPath = path.resolve(directory.path, indexName)
	fs.writeFileSync(indexPath, barrelContent);
	// Update the file tree model with the new index.
	if (!directory.files.some((file: Location) => file.name === indexName)) {
		const index = {
			path: indexPath,
			name: indexName
		}
		logger(`Updating model index @ ${indexPath}`);
		directory.files.push(index);
		directory.index = index;
	}
}

// Build the barrels.
destinations.forEach(buildBarrel);
