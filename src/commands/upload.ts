import { flags } from "@oclif/command";
import Command from "../BaseCommand";
import { CLIError } from "@oclif/errors"; 
import inquirer from "inquirer";
import { target_languages } from "./init";
import configHelper from "../helpers/config";
import upload, { getFileName, uploadData } from "../helpers/upload";
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

    // Load source file
    const inputPath = replaceVariablesInPath(config.input_path, config.input_path, config.source_language);
    const source = loadTranslation(inputPath);

    // Target files
    const files = await getFilePaths(config.input_path);

    for (const file of files) {
      // Get file from API
      const sourcePath = replaceVariablesInPath(file, config.output_path, config.source_language);
      const sourceName = getFileName(sourcePath);

      const apiFile = await upload.saveFile(config, {
        name: sourceName,
        dataformat: "JSON",
        filepath: sourcePath,
        interpolation: config.interpolation, 
        sourceLanguage: config.source_language,
        targetLanguages: config.target_languages
      });

      // Read source file
      const sourceData = loadTranslation(sourcePath);

      // For each target language
      if (response.language === "all") {
        // Read all existing target files from disk
        const tasks: ListrTask[] = config.target_languages.map(
          (lang) => {
            return {
              title: `Upload ${sourcePath} ${config.source_language} => ${lang}`,
              task: async () => {
                try {
                  const targetPath = replaceVariablesInPath(file, config.output_path, lang);

                  const targetData = loadTranslation(targetPath);
      
                  // Upload/Sync with API
                  const result = await uploadData(config, {
                    dataformat: "JSON",
                    sourceData: sourceData,
                    targetData: targetData,
                    file: apiFile.id,
                    sourceLanguage: config.source_language,
                    targetLanguage: lang,
                    interpolation: config.interpolation
                  });

                  return result;
                } catch (e) {
                  throw new CLIError(e);
                }
              },
            }
          },
          {}
        );
        uploadTasks.push(...tasks);
      } else {
        const lang = response.language;
        uploadTasks.push({
          title: `Upload ${sourcePath} ${config.source_language} => ${lang}`,
          task: async () => {
            try {
              const targetPath = replaceVariablesInPath(file, config.output_path, lang);

              const targetData = loadTranslation(targetPath);
      
              const result = await uploadData(config, {
                dataformat: "JSON",
                sourceData: sourceData,
                targetData: targetData,
                file: apiFile.id,
                sourceLanguage: config.source_language,
                targetLanguage: lang,
                interpolation: config.interpolation
              });


            } catch (e) {
              throw new CLIError(e);
            }
          }
        })
      }      
    };

    // Run tasks, continue with next language if error occurs
    const tasks = new Listr(uploadTasks, { exitOnError: false });

    tasks.run().catch((err) => {
      // handled in Listr, continues with translation to next language
      // console.error(err.message);
    });
  }
}
