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

	.help("h")
	.alias("h", "help")
	.default("h", false)

	.version()
	.alias("v", "version")
	.default("v", false)

	.argv;

const rootPath = path.resolve(argv.directory);

interface Location {
	path: string;
	name: string;
}
interface Directory extends Location {
	directories: Directory[],
	files: Location[]
};

function buildTree(directory: string): Directory {
	const names = fs.readdirSync(directory);
	const result: Directory = {
		path: directory,
		name: path.dirname(directory),
		directories: [],
		files: []
	};
	names.forEach((name: string) => {
		const fullPath = path.join(directory, name);
		if (fs.statSync(fullPath).isDirectory()) {
			result.directories.push(buildTree(fullPath));
		} else {
			result.files.push({
				path: directory,
				name
			});
		}
	});
	return result;
}

function walkTree(fileTree: Directory, callback: (fileTree: Directory) => void) {
	callback(fileTree);
	for(const name of Object.keys(fileTree.directories))
	{
		walkTree(fileTree.directories[name], callback);
	}
}

const rootTree = buildTree(rootPath);

if (argv.D) {
	walkTree(rootTree, (fileTree: Directory) => {
		fileTree.files
			.filter((file: Location) => {
				return file.name === "index.ts";
			})
			.forEach((file: Location) => {
				fs.unlinkSync(path.resolve(file.path, file.name))
			});
	});
}

function getModules(fileTree: Directory, localOnly: boolean = false) {
	let files: Location[];
	if (localOnly) {
		files = fileTree.files;
	} else {
		files = [];
		walkTree(fileTree, (currentLocation: Directory) => {
			files = files.concat(currentLocation.files);
		});
	}
	return files.filter((file: Location) => file.name.match(/\.ts$/m) && file.name !== "index.ts");
}

function buildBarrel(fileTree: Directory) {
	fs.writeFileSync(
		path.resolve(fileTree.path, "index.ts"),
		getModules(fileTree).reduce(
			(previous: string, current: Location) => {
				const relativePath = path.relative(fileTree.path, current.path)
				let location = `.${path.sep}${relativePath}`;
				if (relativePath) {
					location += path.sep;
				}
				location += path.basename(current.name, ".ts");
				location = location.replace(/\\+/g, "/");
				return previous += `export * from "${location}";
`;
			},
			""
		)
	);
}

buildBarrel(rootTree);
