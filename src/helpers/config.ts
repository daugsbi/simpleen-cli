import { readFileSync, writeFileSync } from "fs";
import { CLIError } from "@oclif/errors";

export type DataFormat = "JSON" | "YAML" | "Properties" | "PO" | "Markdown"; // PHP Array

export type Formality = "default" | "less" | "more";

export type Interpolation =
  | "i18n" // { variable } without icu messages
  | "i18next" // {{ variable }}
  | "polyglot" // %{ variable }
  | "ruby" // ${ variable }
  | "icu" // { variable, date }, selections
  | "laravel" // :variable
  | "default" // Guess from data
  | "none"; // No interpolations

export type SimpleenConfig = {
  // en, de
  source_language: string;
  target_languages: string[];
  interpolation: Interpolation;
  input_path: string;
  output_path: string;

  // optional, manualy added, i. e. { "FR": 2, "ES": 3 },
  // which means translate from source_language into French and use glossary with ID 2.
  // use glossary with id 3 to translate into spanish
  glossary?: { [target_language: string]: number }; // {}

  // output_path: string;
  auth_key: string;
};

/**
 * Load config file
 * @param configPath optional path incl. filename
 */
export function loadConfig(path: string): SimpleenConfig {
  try {
    // Read config
    const data = readFileSync(path, "utf-8");
    const config = JSON.parse(data);
    return config;
  } catch (e) {
    throw new CLIError(
      `Could not load or parse ${path}. Run simpleen init to create file`
    );
  }
}

/**
 * Save config Files
 * @param responses SimpleenConfig, mostly from prompt init
 * @param configPath optional path incl. filename to write config individually. Reuse in other commands as well
 */
export function saveConfig(responses: SimpleenConfig, path: string): void {
  try {
    writeFileSync(path, JSON.stringify(responses, null, 4), {
      encoding: "utf-8",
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new CLIError(
        `Could not write config file to ${path}. Error: ${
          e.message ? e.message : e
        }`
      );
    }
    throw new CLIError(`Could not write config file to ${path}. Error: ${e}`);
  }
}

export default {
  loadConfig,
  saveConfig,
};
