import { flags } from "@oclif/command";
import Command from "../BaseCommand";
import * as inquirer from "inquirer";
import * as fuzzy from "fuzzy";
import sortBy from "lodash.sortby";
import checkboxPlusPrompt from "inquirer-checkbox-plus-prompt";
import config, { SimpleenConfig } from "../helpers/config";

inquirer.registerPrompt("checkbox-plus", checkboxPlusPrompt);

const google_translate_languages = [
  { name: "Afrikaans", value: "af" },
  { name: "Albanian", value: "sq" },
  { name: "Amharic", value: "am" },
  { name: "Arabic", value: "ar" },
  { name: "Armenian", value: "hy" },
  { name: "Azerbaijani", value: "az" },
  { name: "Basque", value: "eu" },
  { name: "Belarusian", value: "be" },
  { name: "Bengali", value: "bn" },
  { name: "Bosnian", value: "bs" },
  { name: "Bulgarian", value: "bg" },
  { name: "Catalan", value: "ca" },
  { name: "Cebuano", value: "ceb" },
  { name: "Chinese (Traditional)", value: "zh-TW" },
  { name: "Corsican", value: "co" },
  { name: "Croatian", value: "hr" },
  { name: "Czech", value: "cs" },
  { name: "Danish", value: "da" },
  { name: "Esperanto", value: "eo" },
  { name: "Estonian", value: "et" },
  { name: "Finnish", value: "fi" },
  { name: "Frisian", value: "fy" },
  { name: "Galician", value: "gl" },
  { name: "Georgian", value: "ka" },
  { name: "Greek", value: "el" },
  { name: "Gujarati", value: "gu" },
  { name: "Haitian Creole", value: "ht" },
  { name: "Hausa", value: "ha" },
  { name: "Hawaiian", value: "haw" },
  { name: "Hebrew", value: "he" },
  { name: "Hindi", value: "hi" },
  { name: "Hmong", value: "hmn" },
  { name: "Hungarian", value: "hu" },
  { name: "Icelandic", value: "is" },
  { name: "Igbo", value: "ig" },
  { name: "Indonesian", value: "id" },
  { name: "Irish", value: "ga" },
  { name: "Javanese", value: "jv" },
  { name: "Kannada", value: "kn" },
  { name: "Kazakh", value: "kk" },
  { name: "Khmer", value: "km" },
  { name: "Kinyarwanda", value: "rw" },
  { name: "Korean", value: "ko" },
  { name: "Kurdish", value: "ku" },
  { name: "Kyrgyz", value: "ky" },
  { name: "Lao", value: "lo" },
  { name: "Latin", value: "la" },
  { name: "Latvian", value: "lv" },
  { name: "Lithuanian", value: "lt" },
  { name: "Luxembourgish", value: "lb" },
  { name: "Macedonian", value: "mk" },
  { name: "Malagasy", value: "mg" },
  { name: "Malay", value: "ms" },
  { name: "Malayalam", value: "ml" },
  { name: "Maltese", value: "mt" },
  { name: "Maori", value: "mi" },
  { name: "Marathi", value: "mr" },
  { name: "Mongolian", value: "mn" },
  { name: "Myanmar (Burmese)", value: "my" },
  { name: "Nepali", value: "ne" },
  { name: "Norwegian", value: "no" },
  { name: "Nyanja (Chichewa)", value: "ny" },
  { name: "Odia (Oriya)", value: "or" },
  { name: "Pashto", value: "ps" },
  { name: "Persian", value: "fa" },
  { name: "Punjabi", value: "pa" },
  { name: "Serbian", value: "sr" },
  { name: "Sesotho", value: "st" },
  { name: "Shona", value: "sn" },
  { name: "Sindhi", value: "sd" },
  { name: "Sinhala (Sinhalese)", value: "si" },
  { name: "Slovak", value: "sk" },
  { name: "Sindhi", value: "sd" },
  { name: "Sinhala (Sinhalese)", value: "si" },
  { name: "Slovak", value: "sk" },
  { name: "Slovenian", value: "sl" },
  { name: "Somali", value: "so" },
  { name: "Sundanese", value: "su" },
  { name: "Swahili", value: "sw" },
  { name: "Swedish", value: "sv" },
  { name: "Tagalog (Filipino)", value: "tl" },
  { name: "Tajik", value: "tg" },
  { name: "Tamil", value: "ta" },
  { name: "Tatar", value: "tt" },
  { name: "Telugu", value: "te" },
  { name: "Thai", value: "th" },
  { name: "Turkish", value: "tr" },
  { name: "Turkmen", value: "tk" },
  { name: "Ukrainian", value: "uk" },
  { name: "Urdu", value: "ur" },
  { name: "Uyghur", value: "ug" },
  { name: "Uzbek", value: "uz" },
  { name: "Vietnamese", value: "vi" },
  { name: "Welsh", value: "cy" },
  { name: "Xhosa", value: "xh" },
  { name: "Yiddish", value: "yi" },
  { name: "Yoruba", value: "yo" },
  { name: "Zulu", value: "zu" },
];

export const target_languages = sortBy(
  [
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
    ...google_translate_languages,
  ],
  "name"
);

const source_languages = sortBy(
  [
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
    ...google_translate_languages,
  ],
  "name"
);

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

  async run(): Promise<void> {
    const { flags } = this.parse(InitCommand);

    const responses: SimpleenConfig = await inquirer.prompt([
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
            const fuzzyResult = fuzzy.filter(input, target_languages, {
              extract: function (item) {
                return item["name"];
              },
            });

            const data = fuzzyResult.map(function (element) {
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
          { value: "polyglot", name: "%{ variable }" },
          { value: "i18next", name: "{{ variable }}" },
          { value: "i18n", name: "{ variable }" },
          {
            value: "icu",
            name: "ICU Messages, i.e. { variable, number, ::currency/USD }",
          },
          // eslint-disable-next-line
          { value: "ruby", name: "${ variable }" },
          { value: "laravel", name: ":variable" },
          { value: "default", name: "Automatic" },
          { value: "none", name: "None" },
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
          "Where do you want to save the translations? (Combine with variables $LOCALE, $locale, $FOLDER, $FILE which are provided by the input path)",
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
    config.saveConfig(responses, flags.config);

    this.log(`Configuration ${flags.config} saved`);
  }
}
