jest.mock("fs");
import fs from "fs";

import lock, { LockData } from "../../src/helpers/lock";

describe("Test lock helper", () => {
  let readFileSpy: jest.SpyInstance;
  let writeFileSpy: jest.SpyInstance;

  const data = {
    md5FileHash: {
      DE: {
        key1: "value1",
      },
      FR: {
        key1: "translated value 1",
      },
    },
  } as LockData;

  beforeEach(() => {
    readFileSpy = jest
      .spyOn(fs, "readFileSync")
      .mockReturnValue(JSON.stringify(data, null, 4));

    writeFileSpy = jest.spyOn(fs, "writeFileSync");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("it should load specified path from fs", () => {
    lock.loadLockFile("./simpleen.lock.json");

    expect(readFileSpy).toHaveBeenCalledTimes(1);

    expect(readFileSpy).toHaveBeenCalledWith("./simpleen.lock.json", "utf-8");
  });

  test("it should save lockData to specified path", () => {
    lock.saveLockFile(data, "./simpleen.lock.json");

    expect(writeFileSpy).toHaveBeenCalledTimes(1);

    expect(writeFileSpy).toHaveBeenCalledWith(
      "./simpleen.lock.json",
      JSON.stringify(data),
      {
        encoding: "utf-8",
      }
    );
  });
});
