import { test } from "@oclif/test";

jest.mock("../../src/helpers/lock");
import lock, { LockData } from "../../src/helpers/lock";

jest.mock("../../src/helpers/config");
import config, { SimpleenConfig } from "../../src/helpers/config";

jest.mock("../../src/helpers/translation");
import translation from "../../src/helpers/translation";

describe("Test translate command", () => {
  let configSpy: jest.SpyInstance;
  let loadLockSpy: jest.SpyInstance;
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

  const initLock: LockData = {
    // prettier-ignore
    "c1ffdd409b": { FR: { test: "Bonjour à tous" } },
    "7c7c0bddf3": { DE: { test: "Guten Tag." } },
    "4f7beda6b5": { IT: { test: "Salve." } },
    "3c71d20787": { JA: { test: "こんにちは" } },
  };

  beforeEach(() => {
    configSpy = jest.spyOn(config, "loadConfig").mockReturnValue(initConfig);
    loadLockSpy = jest.spyOn(lock, "loadLockFile").mockReturnValue(initLock);
    loadTranslationSpy = jest
      .spyOn(translation, "loadTranslation")
      .mockReturnValue({
        appTitle: "Your app",
        test: "This should be overwritten",
      });

    translateSpy = jest
      .spyOn(translation, "translateIntoLanguage")
      .mockReturnValue(
        Promise.resolve({ appTitle: "Deine App", test: "Guten Tag" })
      );
    // File paths from glob input_path
    loadFilePathsSpy = jest
      .spyOn(translation, "getFilePaths")
      .mockReturnValue(Promise.resolve(["./src/translations/en.json"]));
    saveTranslationSpy = jest.spyOn(translation, "saveTranslation");
  });

  afterEach(() => {
    jest.resetAllMocks();
    // jest.unmock("inquirer");
  });

  test
    .stdout()
    .command(["translate"])
    .it("should load lock file from default path ./simpleen.lock.json", () => {
      // Uses default config
      expect(configSpy).toBeCalledWith("./simpleen.config.json");

      // Uses default lock file
      expect(loadLockSpy).toBeCalledWith("./simpleen.lock.json");

      // Informs user that translation is done
      // expect(ctx.stdout).toBe("Lock file ./simpleen.lock.json saved\n");
    });

  test
    .stdout()
    .command(["translate", "--config", "./translationConfig.json"])
    .it("should load config from specified path", () => {
      // load alternative config
      expect(configSpy).toBeCalledTimes(1);
      expect(configSpy).toBeCalledWith("./translationConfig.json");

      // should not change lock file
      expect(loadLockSpy).toBeCalledWith("./simpleen.lock.json");
    });

  test
    .stdout()
    .command(["translate", "--lockFile", "./translationLock.json"])
    .it("should load lock file from specified path", () => {
      expect(loadLockSpy).toBeCalledTimes(1);
      // load lockfile from alternative
      expect(loadLockSpy).toBeCalledWith("./translationLock.json");
    });

  test
    .stdout()
    .command(["translate"])
    .it("should not overwrite locked test from translation file", () => {
      // For each file from input_path
      expect(loadTranslationSpy).toBeCalledTimes(1);

      // Load each input file
      expect(loadTranslationSpy).toHaveBeenLastCalledWith(
        "./src/translations/en.json"
      );

      // For each input file
      expect(loadFilePathsSpy).toBeCalledTimes(1);

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
    });
});
