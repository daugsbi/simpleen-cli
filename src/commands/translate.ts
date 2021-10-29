import { flags } from "@oclif/command";
import chalk from "chalk";
import Command from "../BaseCommand";
import { CLIError } from "@oclif/errors";
import Listr, { ListrTask } from "listr";
import configHelper from "../helpers/config";
import translationHelper from "../helpers/translation";
import { getUsage } from "../helpers/usage";
import { getDataFormatfromFile } from "../helpers/upload";

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

          const dataformat = getDataFormatfromFile(file);

          // Check if target and source format is same
          if (dataformat !== getDataFormatfromFile(targetFile)) {
            throw new CLIError(
              "Source- and targetfile need to have same extension"
            );
          }

          // Add to tasks
          translationTasks.push({
            title: `Translate ${file} ${config.source_language} => ${language}`,
            task: async () => {
              try {
                const result = await translationHelper.translateIntoLanguage(
                  config,
                  dataformat,
                  translationData,
                  language
                );

                translationHelper.saveTranslation(
                  targetFile,
                  dataformat,
                  result
                );
              } catch (e) {
                if (e instanceof Error || typeof e === "string") {
                  throw new CLIError(e);
                }
                throw new CLIError("Unknown error: " + e);
              }
            },
          });
        });
      } catch (e) {
        if (e instanceof Error || typeof e === "string") {
          throw new CLIError(e);
        }
        throw new CLIError("Unknown error: " + e);
      }
    });

    // Check usage after all translations
    translationTasks.push({
      title: "Check usage",
      task: async () => {
        const quota = await getUsage(config);
        if (quota.usage.segment >= quota.plan.maxSegment) {
          console.warn(
            chalk.yellow(
              "Limit reached. All text segments that exceed your usage limit are omitted from the result. \nYou can upgrade now to keep localizing on https://simpleen.io/app/#/upgrade"
            )
          );
        }
      },
    });

    // Run tasks, continue with next language if error occurs
    const tasks = new Listr(translationTasks, { exitOnError: false });

    tasks.run().catch(() => {
      // handled in Listr, continues with translation to next language
      // console.error(err.message);
    });
  }
}
