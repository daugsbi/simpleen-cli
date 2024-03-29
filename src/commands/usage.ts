import { flags } from "@oclif/command";
import chalk from "chalk";
import Command from "../BaseCommand";
import { CLIError } from "@oclif/errors";
import { getUsage } from "../helpers/usage";
import configHelper from "../helpers/config";

/**
 * Get current quota / usage of API
 */
export class UsageCommand extends Command {
  static description = "Displays the current quota and usage of your plan";

  static flags = {
    config: flags.string({
      default: "./simpleen.config.json",
      description: "Defines where the config file is located",
    }),
  };

  async run(): Promise<void> {
    const { flags } = this.parse(UsageCommand);

    try {
      const config = configHelper.loadConfig(flags.config);
      const result = await getUsage(config);

      console.log(
        `Used ${result.usage.segment} of ${result.plan.maxSegment} Segments`
      );
      if (result.usage.segment >= result.plan.maxSegment) {
        console.warn(
          chalk.yellow(
            "Limit reached. \nYou can upgrade now to keep localizing on https://simpleen.io/app/#/upgrade"
          )
        );
      }
    } catch (e) {
      if (e instanceof Error || typeof e === "string") {
        throw new CLIError(e);
      }
      throw new CLIError("Unknown error");
    }
  }
}
