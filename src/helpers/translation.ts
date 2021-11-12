import { CLIError } from "@oclif/errors";
import path from "path";
import glob, { IOptions } from "glob";
import { DataFormat, SimpleenConfig } from "./config";
import { createData } from "./api";
import { readFileSync, existsSync } from "fs";
import { writeFileSync } from "fs";

export type TranslationData = string;

/**
 * Replace variables in provided outputPath
 *
 * @param filePath a specific matched filePath
 * @param outputPath the path including variables
 * @param language current locale
 */
export function replaceVariablesInPath(
  filePath: string,
  outputPath: string,
  language: string
): string {
  const file = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath)
    ? path.extname(filePath).substr(1)
    : path.extname(filePath);
  const folder = path.basename(path.dirname(filePath));

  const targetPath = filePath.split(file)[0];

  return outputPath
    .replace("$LOCALE", language.toUpperCase())
    .replace("$locale", language.toLowerCase())
    .replace("$FOLDER", folder)
    .replace("$PATH", targetPath)
    .replace("$FILE", file)
    .replace("$EXTENSION", ext);
}

/**
 * Returns all matched paths
 * @param inputPath string with glob variables
 */
export function getFilePaths(inputPath: string): Promise<string[]> {
  const options: IOptions = {
    ignore: "**/node_modules/**",
    nonull: true,
  };

  return new Promise((resolve, reject) => {
    glob(inputPath, options, (err, files) => {
      if (err) {
        reject(err.message);
      }

      resolve(files);
    });
  });
}

/**
 * Translates into language and merge with already translated data
 * @param config loaded simpleen config file
 * @param translatedData already translated data
 * @param toBeTranslated data that needs to be translated
 * @param language the language locale, i. e. EN
 */
export function translateIntoLanguage(
  config: SimpleenConfig,
  dataformat: DataFormat,
  toBeTranslated: TranslationData,
  language: string
): Promise<TranslationData> {
  const glossary =
    config.glossary && config.glossary[language]
      ? config.glossary[language]
      : undefined;

  return createData(config, "translate", {
    format: dataformat,
    interpolation: config.interpolation,
    source_language: config.source_language,
    target_language: language,
    glossary,
    text: toBeTranslated,
  }).then((data: unknown) => {
    // merge with translatedData
    return data as TranslationData;
  });
}

export function loadTranslation(file: string): TranslationData {
  try {
    if (existsSync(file)) {
      const data = readFileSync(file, "utf-8");
      return data;
    }
    // File does not exist
    throw new CLIError(`File does not exist: ${file}`);
  } catch (e) {
    if (e instanceof Error) {
      // Probably file is corrupt
      throw new CLIError(`Could not load file: ${file} \n ${e.message}`);
    }
    throw new CLIError(`Could not load file: ${file} \n ${e}`);
  }
}

export function saveTranslation(
  targetFile: string,
  dataformat: DataFormat,
  data: TranslationData
): void {
  try {
    if (dataformat === "JSON") {
      writeFileSync(targetFile, JSON.stringify(data, null, 2));
    } else {
      writeFileSync(targetFile, data);
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new CLIError("Could not save translation result - " + e.message);
    }
    throw new CLIError("Could not save translation result - " + e);
  }
}

export default {
  replaceVariablesInPath,
  getFilePaths,
  loadTranslation,
  translateIntoLanguage,
  saveTranslation,
};
