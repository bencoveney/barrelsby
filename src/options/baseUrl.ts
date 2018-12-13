import path from "path";

export type BaseUrl = string | undefined;

export function getCombinedBaseUrl(
  rootPath: string,
  baseUrl: BaseUrl
): BaseUrl {
  return baseUrl ? path.join(rootPath, baseUrl) : undefined;
}
