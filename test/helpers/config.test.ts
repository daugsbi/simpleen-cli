jest.mock("fs");
import fs from "fs";

import config, { SimpleenConfig } from "../../src/helpers/config";

describe("Test config helper", () => {
  let readFileSpy: jest.SpyInstance;
  let writeFileSpy: jest.SpyInstance;

  const initConfig = {
    input_path: "./locales/de/**.json",
  } as SimpleenConfig;

  beforeEach(() => {
    readFileSpy = jest
      .spyOn(fs, "readFileSync")
      .mockReturnValue(JSON.stringify(initConfig));

    writeFileSpy = jest.spyOn(fs, "writeFileSync");
    /*
    readFileSpy = jest.fn(readFileSync);
    writeFileSpy = jest.fn(writeFileSync);
    */
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("it should load specified path from fs", () => {
    const configResult = config.loadConfig("./test/data/simpleen.config.json");

    expect(readFileSpy).toHaveBeenCalledTimes(1);

    expect(readFileSpy).toHaveBeenCalledWith(
      "./test/data/simpleen.config.json",
      "utf-8"
    );

    // Config is parsed
    expect(configResult).toMatchObject(initConfig);
  });

  test("it should save to specified path", () => {
    const data = {
      input_path: "./src/translations/$locale.json",
    } as SimpleenConfig;

    config.saveConfig(data, "./simpleen.config.json");

    expect(writeFileSpy).toHaveBeenCalledTimes(1);

    expect(writeFileSpy).toHaveBeenCalledWith(
      "./simpleen.config.json",
      JSON.stringify(data, null, 4),
      { encoding: "utf-8" }
    );
  });
});
