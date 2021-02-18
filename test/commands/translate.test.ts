import { test } from "@oclif/test";

jest.mock("../../src/helpers/config");
import config, { SimpleenConfig } from "../../src/helpers/config";

jest.mock("../../src/helpers/translation");
import translation from "../../src/helpers/translation";

describe("Test translate command", () => {
  let configSpy: jest.SpyInstance;
  let loadFilePathsSpy: jest.SpyInstance;
  let loadTranslationSpy: jest.SpyInstance;
  let translateSpy: jest.SpyInstance;
  let saveTranslationSpy: jest.SpyInstance;

  const initConfig: SimpleenConfig = {
    source_language: "EN",
    target_languages: ["FR", "DE", "IT", "JA"],
    interpolation: "i18n",
    input_path: "./src/translations/en.json",
    output_path: "./src/translations/$locale.json",
    auth_key: "123456789-1234-1234-123456789-12",
  };

  beforeEach(() => {
    configSpy = jest.spyOn(config, "loadConfig").mockReturnValue(initConfig);
    loadTranslationSpy = jest
      .spyOn(translation, "loadTranslation")
      .mockReturnValue(
        '{\
        appTitle: "Your app",\
        test: "This should be overwritten",\
      }'
      );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    translateSpy = jest
      .spyOn(translation, "translateIntoLanguage")
      .mockReturnValue(
        Promise.resolve('{ appTitle: "Deine App", test: "Guten Tag" }')
      );

    // File paths from glob input_path
    loadFilePathsSpy = jest
      .spyOn(translation, "getFilePaths")
      .mockReturnValue(Promise.resolve(["./src/translations/en.json"]));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    saveTranslationSpy = jest.spyOn(translation, "saveTranslation");
  });

  afterEach(() => {
    jest.resetAllMocks();
    // jest.unmock("inquirer");
  });

  test
    .stdout()
    .command(["translate", "--config", "./translationConfig.json"])
    .it("should load config from specified path", () => {
      // load alternative config
      expect(configSpy).toBeCalledTimes(1);
      expect(configSpy).toBeCalledWith("./translationConfig.json");
    });

  test
    .stdout()
    .command(["translate"])
    .it("should translate to each target file", () => {
      // For each file from input_path
      expect(loadTranslationSpy).toBeCalledTimes(1);

      // Load each input file
      expect(loadTranslationSpy).toHaveBeenLastCalledWith(
        "./src/translations/en.json"
      );

      // For each input file
      expect(loadFilePathsSpy).toBeCalledTimes(1);

      /* Todo: Add again
      // For each file and language -> 1 input file and 4 target languages
      expect(translateSpy).toBeCalledTimes(4);
      
      expect(saveTranslationSpy).toBeCalledTimes(4);

      expect(saveTranslationSpy).toHaveBeenLastCalledWith(
        undefined,
        expect.objectContaining({
          appTitle: "Deine App",
          test: "Guten Tag",
        })
      );
      */
    });
});
