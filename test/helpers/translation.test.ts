import translation from "../../src/helpers/translation";

describe("Test translation helper", () => {
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
