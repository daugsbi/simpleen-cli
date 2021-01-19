import Command, { flags } from "@oclif/command";
import inquirer from "inquirer";
import chalk from "chalk";
import { target_languages } from "./init";
import configHelper from "../helpers/config";
import lockHelper, { LockData } from "../helpers/lock";
import {
  replaceVariablesInPath,
  getHashFromPath,
  getFilePaths,
  loadTranslation,
} from "../helpers/translation";

/**
 * Locks the translations of the configured target languages
 * The locked translations will not be changed afterwards
 */
export class LockCommand extends Command {
  static description = "[Deprecated] Lock the current translation values";

  static flags = {
    config: flags.string({
      default: "./simpleen.config.json",
      description: "Defines where the config is located",
    }),
    lockFile: flags.string({
      default: "./simpleen.lock.json",
      description: "Defines where the lock file will be created",
    }),
  };

  async run(): Promise<void> {
    console.warn(
      chalk.yellow("[Deprecated] Translations are saved on simpleen.io")
    );

    const { flags } = this.parse(LockCommand);
    const config = configHelper.loadConfig(flags.config);

    const target_languages_choices = target_languages.filter((l) =>
      config.target_languages.includes(l.value)
    );

    // Let the user select the target language to lock
    const response = await inquirer.prompt([
      {
        name: "language",
        message: "Select the target language you want to lock",
        type: "list",
        choices: [{ name: "All", value: "all" }, ...target_languages_choices],
      },
    ]);

    let translations: LockData;

    const files = await getFilePaths(config.input_path);

    files.forEach((file) => {
      if (response.language === "all") {
        // Read all existing language files
        translations = config.target_languages.reduce(
          // eslint-disable-next-line
          (translations: any, lang) => {
            const path = replaceVariablesInPath(file, config.output_path, lang);
            const hashedPath = getHashFromPath(path);

            const result = loadTranslation(path);

            return {
              ...translations,
              [hashedPath]: {
                ...translations[hashedPath],
                [lang]: result,
              },
            };
          },
          {}
        );
      } else {
        // Read lockfile
        const lockData = lockHelper.loadLockFile(flags.lockFile);

        const lang = response.language;
        const path = replaceVariablesInPath(file, config.output_path, lang);
        const hashedPath = getHashFromPath(path);

        // Merge lock file with selected language
        translations = {
          ...lockData,
          [hashedPath]: {
            ...lockData[hashedPath],
            [lang]: loadTranslation(path),
          },
        };
      }

      // Save lock file to further use in translate command
      lockHelper.saveLockFile(translations, flags.lockFile);

      this.log(`Lock file ${flags.lockFile} saved`);
    });
  }
}
