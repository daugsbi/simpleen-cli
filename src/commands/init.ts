import Command, { flags } from "@oclif/command";
import * as inquirer from "inquirer";
import * as fuzzy from "fuzzy";
import { SimpleenConfig, saveConfig } from "../helpers/config";

inquirer.registerPrompt(
  "checkbox-plus",
  require("inquirer-checkbox-plus-prompt")
);

export const target_languages = [
  { name: "Chinese", value: "ZH" },
  { name: "Dutch", value: "NL" },
  { name: "English (American)", value: "EN-US" },
  { name: "English (British)", value: "EN-GB" },
  { name: "French", value: "FR" },
  { name: "German", value: "DE" },
  { name: "Italian", value: "IT" },
  { name: "Japanese", value: "JA" },
  { name: "Polish", value: "PL" },
  {
    name:
      "Portuguese (all Portuguese varieties excluding Brazilian Portuguese)",
    value: "PT-PT",
  },
  { name: "Portuguese (Brazilian)", value: "PT-BR" },
  { name: "Russian", value: "RU" },
  { name: "Spanish", value: "ES" },
];

const source_languages = [
  { name: "Chinese", value: "ZH" },
  { name: "Dutch", value: "NL" },
  { name: "English", value: "EN" },
  { name: "French", value: "FR" },
  { name: "German", value: "DE" },
  { name: "Italian", value: "IT" },
  { name: "Japanese", value: "JA" },
  { name: "Polish", value: "PL" },
  { name: "Portuguese", value: "PT" },
  { name: "Russian", value: "RU" },
  { name: "Spanish", value: "ES" },
];

/**
 * Configure the project and save the result for later usage (in translate, lock)
 * This is the first step to initialize any new project.
 */
export class InitCommand extends Command {
  static description = "Configure your project";

  static flags = {
    config: flags.string({
      default: "./simpleen.config.json",
      description: "Defines where the config file will be created",
    }),
  };

  async run() {
    const { flags } = this.parse(InitCommand);

    let responses: SimpleenConfig = await inquirer.prompt([
      {
        name: "source_language",
        message: "Select your source language",
        default: "EN",
        type: "list",
        choices: source_languages,
      },
      {
        name: "target_languages",
        message: "Select your target languages (multiple with spacebar)",
        type: "checkbox-plus",
        highlight: true,
        searchable: true,
        validate: function (answer) {
          if (answer.length == 0) {
            return "You must choose at least one target language.";
          }
          return true;
        },
        source: function (answersSoFar: string[], input: string) {
          input = input || "";

          return new Promise(function (resolve) {
            var fuzzyResult = fuzzy.filter(input, target_languages, {
              extract: function (item) {
                return item["name"];
              },
            });

            var data = fuzzyResult.map(function (element) {
              return element.original;
            });

            resolve(data);
          });
        },
      },
      {
        name: "interpolation",
        message: "Select your interpolation",
        type: "list",
        choices: [
          { name: "{{ variable }}", value: "i18next" },
          { name: "{ variable }", value: "i18n" },
          { name: "%{ variable }", value: "polyglot" },
          { name: "${ variable }", value: "ruby" },
        ],
      },
      {
        name: "input_path",
        messsage:
          "Where is your locale file saved?  (Use glob patterns like ./**/en.json or ./**/en/*.json for multiple files)",
        type: "input",
      },
      {
        name: "output_path",
        message:
          "Where do you want to save the translations? (Combine with variables $LOCALE, $locale, $FOLDERNAME, $FILENAME which are provided by the input path)",
        type: "input",
      },
      {
        name: "auth_key",
        message:
          "Enter your Authentication-Key from simpleen.io/app/#/integration",
        type: "password",
        mask: "*",
        validate: function (answer) {
          // Validate API-Key via request
          if (answer.length < 32) {
            return "The entered Authentication-Key is too short and therefore invalid.";
          }
          return true;
        },
      },
    ]);

    // Save configuration for further usage
    saveConfig(responses, flags.config);

    this.log(`Configuration ${flags.config} saved`);
  }
}
