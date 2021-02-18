import { flags } from "@oclif/command";
import { CLIError } from "@oclif/errors";
import Command from "../BaseCommand";

/**
 * Locks the translations of the configured target languages
 * The locked translations will not be changed afterwards
 */
export class LockCommand extends Command {
  static description = "[Deprecated] Lock the current translation values";

  static flags = {
    config: flags.string({
      default: "./simpleen.config.json",
      description: "Defines where the config is located",
    }),
    lockFile: flags.string({
      default: "./simpleen.lock.json",
      description: "Defines where the lock file will be created",
    }),
  };

  async run(): Promise<void> {
    throw new CLIError("[Deprecated] Translations are saved on simpleen.io");
  }
}
