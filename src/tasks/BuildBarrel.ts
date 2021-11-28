import {convertPathSeparator} from "../utilities";
import {QuoteCharacter} from "../options/quoteCharacter";
import {SemicolonCharacter} from "../options/noSemicolon";
import {Logger} from "../options/logger";
import {BaseUrl} from "../options/baseUrl";
import {loadDirectoryModules} from "../modules";
import path from "path";
import {addHeaderPrefix} from "../builders/header";
import fs from "fs";
import {BarrelBuilder} from "../builder";
import {Directory} from "../interfaces/directory.interface";

export class BuildBarrel {
    constructor (
        directory: Directory,
        builder: BarrelBuilder,
        quoteCharacter: QuoteCharacter,
        semicolonCharacter: SemicolonCharacter,
        barrelName: string,
        logger: Logger,
        baseUrl: BaseUrl,
        exportDefault: boolean,
        local: boolean,
        include: string[],
        exclude: string[]
    ) {
        logger.debug(`Building barrel @ ${directory.path}`);
        const content = builder(
            directory,
            loadDirectoryModules(directory, logger, include, exclude, local),
            quoteCharacter,
            semicolonCharacter,
            logger,
            baseUrl,
            exportDefault
        );
        const destination = path.join(directory.path, barrelName);
        if (content.length === 0) {
            // Skip empty barrels.
            return;
        }
        // Add the header
        const contentWithHeader = addHeaderPrefix(content);
        fs.writeFileSync(destination, contentWithHeader);
        // Update the file tree model with the new barrel.
        if (!directory.files.some((file) => file.name === barrelName)) {
            const convertedPath = convertPathSeparator(destination);
            const barrel = {
                name: barrelName,
                path: convertedPath,
            };
            logger.debug(`Updating model barrel @ ${convertedPath}`);
            directory.files.push(barrel);
            directory.barrel = barrel;
        }
    }
}