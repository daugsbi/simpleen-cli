import translation from "../../src/helpers/translation";

describe("Test translation helper", () => {
  test("it should md5 hash path with a length of 10", () => {
    const hash1 = translation.getHashFromPath("./src/translations");
    const hash2 = translation.getHashFromPath("./src/translation2");

    expect(hash1).not.toBe(hash2);

    // hash of ./src/translations is c916da29a0fb75b1953046252a7f4b54
    expect(hash1).toBe("c916da29a0fb75b1953046252a7f4b54".substr(0, 10));
    // hash of ./src/translation2 is 511daad8e187802657dc415d14f3d91a
    expect(hash2).toBe("511daad8e187802657dc415d14f3d91a".substr(0, 10));
  });

  test("it should replace variables correctly", () => {
    const testLocale = translation.replaceVariablesInPath(
      "./locale/en.json",
      "./locale/$locale.json",
      "fr"
    );
    expect(testLocale).toBe("./locale/fr.json");

    const testUppercaseLocale = translation.replaceVariablesInPath(
      "./locale/en.json",
      "./locale/$LOCALE.json",
      "fr"
    );
    expect(testUppercaseLocale).toBe("./locale/FR.json");

    const testFolderName = translation.replaceVariablesInPath(
      "./locale/en.json",
      "./$FOLDER/$locale.json",
      "ja"
    );
    expect(testFolderName).toBe("./locale/ja.json");

    const testFileName = translation.replaceVariablesInPath(
      "./locale/en/product.json",
      "./locale/$locale/$FILE.$EXTENSION",
      "es"
    );
    expect(testFileName).toBe("./locale/es/product.json");
  });
});
