import { test } from "@oclif/test";

jest.mock("inquirer");
import inquirer from "inquirer";

jest.mock("../../src/helpers/config");
import config from "../../src/helpers/config";

describe("Test init command", () => {
  let configSpy: jest.SpyInstance;
  let inquirerSpy: jest.SpyInstance;

  const initData = {
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
      .mockImplementation(async () => initData);

    configSpy = jest.spyOn(config, "saveConfig");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test
    .stdout()
    .command(["init"])
    .it(
      "should save config to default output ./simpleen.config.json",
      (ctx) => {
        // Saves once
        expect(configSpy).toBeCalledTimes(1);

        // Uses data and default path
        expect(configSpy).toBeCalledWith(initData, "./simpleen.config.json");

        expect(inquirerSpy).toBeCalledTimes(1);

        // Informs user that file is saved
        expect(ctx.stdout).toBe("Configuration ./simpleen.config.json saved\n");
      }
    );

  test
    .stdout()
    .command(["init", "--config", "./translationConfig.json"])
    .it("should save config to optional path", (ctx) => {
      // Uses data and provided path
      expect(configSpy).toBeCalledWith(initData, "./translationConfig.json");

      // Inform that file is saved on corresponding config path
      expect(ctx.stdout).toBe("Configuration ./translationConfig.json saved\n");
    });
});
