import { flags } from "@oclif/command";
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
          "All segments used. Please upgrade on https://simpleen.io/app/#/upgrade"
        );
      }
    } catch (e) {
      throw new CLIError(e);
    }
  }
}
