import path from "path";
import md5 from "md5";
import glob, { IOptions } from "glob";
import axios from "axios";
import { SimpleenConfig } from "./config";

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
  const ext = path.extname(filePath);
  const folder = path.basename(path.dirname(filePath));

  return outputPath
    .replace("$LOCALE", language.toUpperCase())
    .replace("$locale", language.toLowerCase())
    .replace("$FOLDERNAME", folder)
    .replace("$FILE", file)
    .replace("$EXTENSION", ext);
}

/**
 * Hash path to support multiple files in lock file
 * @param path of file
 */
export function getHashFromPath(path: string): string {
  return md5(path).slice(0, 10);
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
  translatedData: any,
  toBeTranslated: any,
  language: string
) {
  return new Promise((resolve, reject) => {
    // Translate
    axios
      .post(
        "https://api.simpleen.io/translate",
        {
          format: "JSON",
          interpolation: config.interpolation,
          source_language: config.source_language,
          target_language: language,
          text: JSON.stringify(toBeTranslated),
        },
        {
          params: {
            auth_key: config.auth_key,
          },
        }
      )
      .then((value: any) => {
        // merge with translatedData
        resolve({
          ...translatedData,
          ...value.data,
        });
      })
      .catch((e) => {
        console.log(e.message);
        reject(e.message);
      });
  });
}
