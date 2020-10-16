import Command, { flags } from "@oclif/command";
import { CLIError } from "@oclif/errors";
import flatten from "flat";
import omit from "lodash.omit";
import Listr, { ListrTask } from "listr";
import configHelper from "../helpers/config";
import lockHelper from "../helpers/lock";
import translationHelper from "../helpers/translation";

/**
 * Translates project to the configured target languages
 * considers the lock file to exclude allready translated/verfied translations
 */
export class TranslateCommand extends Command {
  static description = "Translate project";

  static flags = {
    config: flags.string({
      default: "./simpleen.config.json",
      description: "Defines where you config file is located",
    }),
    lockFile: flags.string({
      default: "./simpleen.lock.json",
      description: "Defines where your lock file is located",
    }),
  };

  async run(): Promise<void> {
    const { flags } = this.parse(TranslateCommand);

    const config = configHelper.loadConfig(flags.config);

    const translationTasks: ListrTask[] = [];

    // Read lock file
    const lockData = lockHelper.loadLockFile(flags.lockFile);

    // Read all source files to translate
    const files = await translationHelper.getFilePaths(config.input_path);

    // Read each file and translate it
    files.forEach((file) => {
      try {
        const translationData = translationHelper.loadTranslation(file);

        config.target_languages.forEach((language: string) => {
          // Target file
          const targetFile = translationHelper.replaceVariablesInPath(
            file,
            config.output_path,
            language
          );
          const targetHash = translationHelper.getHashFromPath(targetFile);

          const translatedData = lockData?.[targetHash]?.[language]
            ? lockData[targetHash][language]
            : {};

          // Omit keys from lock file
          const omitKeys = Object.keys(flatten(translatedData));

          const toBeTranslated = omit(translationData, omitKeys);

          const total = Object.keys(flatten(translationData)).length;
          const totalTranslate = Object.keys(toBeTranslated).length;

          // Add to tasks
          translationTasks.push({
            title: `Translate ${totalTranslate}/${total} ${config.source_language} => ${language}`,
            task: async () => {
              try {
                const result = await translationHelper.translateIntoLanguage(
                  config,
                  translatedData,
                  toBeTranslated,
                  language
                );

                translationHelper.saveTranslation(targetFile, result);
              } catch (e) {
                throw new CLIError(e);
              }
            },
            skip: () => {
              if (total === 0) {
                return "No data found to translate";
              }
              if (totalTranslate === 0) {
                return `All keys are locked (${omitKeys.length} of ${total})`;
              }
              return false;
            },
          });
        });
      } catch (e) {
        throw new CLIError(e);
      }
    });

    // Run tasks
    const tasks = new Listr(translationTasks);

    tasks.run().catch((err) => {
      this.error(err);
    });
  }
}
