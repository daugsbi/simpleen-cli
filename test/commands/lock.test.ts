import { test } from "@oclif/test";

jest.mock("inquirer");
import inquirer from "inquirer";

jest.mock("../../src/helpers/lock");
import lock from "../../src/helpers/lock";

jest.mock("../../src/helpers/config");
import config, { SimpleenConfig } from "../../src/helpers/config";

describe("Test lock command with language all", () => {
  let configSpy: jest.SpyInstance;
  let loadLockSpy: jest.SpyInstance;
  let writeLockSpy: jest.SpyInstance;
  let inquirerSpy: jest.SpyInstance;

  const chose = {
    language: "all",
  };

  const initConfig: SimpleenConfig = {
    source_language: "EN",
    target_languages: ["FR", "DE", "IT", "JA"],
    interpolation: "i18n",
    input_path: "./src/translations/en.json",
    output_path: "./src/translations/$locale.json",
    auth_key: "123456789-1234-1234-123456789-12",
  };

  beforeEach(() => {
    inquirerSpy = jest
      .spyOn(inquirer, "prompt")
      // @ts-ignore
      .mockImplementation(async () => chose);

    loadLockSpy = jest.spyOn(lock, "loadLockFile");
    writeLockSpy = jest.spyOn(lock, "saveLockFile");
    configSpy = jest.spyOn(config, "loadConfig").mockReturnValue(initConfig);
  });

  afterEach(() => {
    jest.resetAllMocks();
    // jest.unmock("inquirer");
  });

  test
    .stdout()
    .command(["lock"])
    .it("should save lock file to default path ./simpleen.lock.json", (ctx) => {
      // Saves once
      // expect(writeLockSpy).toBeCalledTimes(1);

      // Uses default path
      expect(writeLockSpy).toBeCalledWith(
        expect.anything(),
        "./simpleen.lock.json"
      );

      // Uses default config
      expect(configSpy).toBeCalledWith("./simpleen.config.json");

      // Expect that inquirer asks for language to lock
      expect(inquirerSpy).toBeCalledTimes(1);

      // It should not load existing lock file, if all is selected
      expect(loadLockSpy).toBeCalledTimes(0);

      // Informs user that file is saved
      expect(ctx.stdout).toBe("Lock file ./simpleen.lock.json saved\n");
    });

  test
    .stdout()
    .command(["lock", "--config", "./translationConfig.json"])
    .it("should load config from specified path", (ctx) => {
      // load alternative config
      expect(configSpy).toBeCalledTimes(1);
      expect(configSpy).toBeCalledWith("./translationConfig.json");

      // should not change lock file
      expect(ctx.stdout).toBe("Lock file ./simpleen.lock.json saved\n");
    });

  test
    .stdout()
    .command(["lock", "--lockFile", "./translationLock.json"])
    .it("should save lock file to alternative path", (ctx) => {
      // save lockfile to alternative
      expect(writeLockSpy).toBeCalledTimes(1);

      expect(writeLockSpy).toBeCalledWith(
        expect.anything(),
        "./translationLock.json"
      );

      // should inform user of alternative path
      expect(ctx.stdout).toBe("Lock file ./translationLock.json saved\n");
    });
});
