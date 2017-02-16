#! /usr/bin/env node

import * as fs from "fs";
import * as path from "path";

import * as Yargs from "yargs";

var argv = Yargs
	.usage("Usage: barrelsby <command> [options]")
	.command("count", "Count the lines in a file")
	.example("barrelsby", "Run barrelsby")
	.alias("d", "directory")
	.nargs("d", 1)
	.describe("d", "The directory to create barrels for.")
	.default("d", "./")
	.help("h")
	.alias("h", "help")
	.version()
	.alias("v", "version")
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

function processDirectory(directory: string): Directory {
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
			result.directories.push(processDirectory(fullPath));
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

function isTypeScriptFile(file: string) {
	return ;
}

function getTypeScriptFiles(fileTree: Directory, localOnly: boolean = false) {
	let files: Location[];
	if (localOnly) {
		files = fileTree.files;
	} else {
		files = [];
		walkTree(fileTree, (currentLocation: Directory) => {
			files = files.concat(currentLocation.files);
		});
	}
	return files.filter((file: Location) => file.name.match(/\.ts$/m));
}

function buildBarrel(fileTree: Directory) {
	fs.writeFileSync(
		path.resolve(fileTree.path, "index.ts"),
		getTypeScriptFiles(fileTree).reduce(
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

buildBarrel(processDirectory(rootPath));
