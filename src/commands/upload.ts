import { flags } from "@oclif/command";
import Command from "../BaseCommand";
import { CLIError } from "@oclif/errors";
import inquirer from "inquirer";
import { target_languages } from "./init";
import configHelper from "../helpers/config";
import upload, {
  getDataFormatfromFile,
  getFileName,
  uploadData,
} from "../helpers/upload";
import {
  replaceVariablesInPath,
  getFilePaths,
  loadTranslation,
} from "../helpers/translation";
import Listr, { ListrTask } from "listr";

/**
 * Upload already translated or adapted translation values
 * After upload translated values, they will be used in future translations
 */
export class UploadCommand extends Command {
  static description = "Upload already translated/adapted translation values";

  static flags = {
    config: flags.string({
      default: "./simpleen.config.json",
      description: "Defines where the config is located",
    }),
  };

  async run(): Promise<void> {
    const { flags } = this.parse(UploadCommand);
    const config = configHelper.loadConfig(flags.config);

    const target_languages_choices = target_languages.filter((l) =>
      config.target_languages.includes(l.value)
    );

    // Let the user select the target language to upload
    const response = await inquirer.prompt([
      {
        name: "language",
        message: "Select the target language you want to upload",
        type: "list",
        choices: [{ name: "All", value: "all" }, ...target_languages_choices],
      },
    ]);

    const uploadTasks: ListrTask[] = [];

    // Read all source files
    const files = await getFilePaths(config.input_path);

    for (const file of files) {
      const sourceName = getFileName(file);

      const dataformat = getDataFormatfromFile(file);

      // Check if file exists in Simpleen Backend
      const apiFile = await upload.saveFile(config, {
        name: sourceName,
        dataformat,
        filepath: file,
        interpolation: config.interpolation,
        sourceLanguage: config.source_language,
        targetLanguages: config.target_languages,
      });

      // Read source file
      const sourceData = loadTranslation(file);

      // For each target language
      if (response.language === "all") {
        // Read all existing target files from disk
        const tasks: ListrTask[] = config.target_languages.map((lang) => {
          return {
            title: `Upload ${file} ${config.source_language} => ${lang}`,
            task: async () => {
              try {
                const targetPath = replaceVariablesInPath(
                  file,
                  config.output_path,
                  lang
                );

                // Check if loaded source and target has same extension
                if (dataformat !== getDataFormatfromFile(targetPath)) {
                  throw new CLIError(
                    "Source- and targetfile need to have same extension"
                  );
                }

                const targetData = loadTranslation(targetPath);

                // Upload/Sync with API
                const result = await uploadData(config, {
                  dataformat: dataformat,
                  sourceData: sourceData,
                  targetData: targetData,
                  file: apiFile.id,
                  sourceLanguage: config.source_language,
                  targetLanguage: lang,
                  interpolation: config.interpolation,
                });

                return result;
              } catch (e) {
                throw new CLIError(e);
              }
            },
          };
        }, {});
        uploadTasks.push(...tasks);
      } else {
        const lang = response.language;
        uploadTasks.push({
          title: `Upload ${file} ${config.source_language} => ${lang}`,
          task: async () => {
            try {
              const targetPath = replaceVariablesInPath(
                file,
                config.output_path,
                lang
              );

              const targetData = loadTranslation(targetPath);

              const result = await uploadData(config, {
                dataformat,
                sourceData: sourceData,
                targetData: targetData,
                file: apiFile.id,
                sourceLanguage: config.source_language,
                targetLanguage: lang,
                interpolation: config.interpolation,
              });
              return result;
            } catch (e) {
              throw new CLIError(e);
            }
          },
        });
      }
    }

    // Run tasks, continue with next language if error occurs
    const tasks = new Listr(uploadTasks, { exitOnError: false });

    tasks.run().catch(() => {
      // handled in Listr, continues with translation to next language
      // console.error(err.message);
    });
  }
}
