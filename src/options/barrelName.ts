import { isTypeScriptFile } from "../utilities";

export function getBarrelName(
  name: string,
  logger: (message: string) => void
): string {
  // Resolve barrel name.
  const nameArgument: string = name;
  const barrelName = nameArgument.match(isTypeScriptFile)
    ? nameArgument
    : `${nameArgument}.ts`;

  logger(`Using name ${barrelName}`);

  return barrelName;
}
