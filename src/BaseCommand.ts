import Command from "@oclif/command";
import chalk from "chalk";

export default abstract class extends Command {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async catch(err: Error) {
    if (err.message) {
      console.error(chalk.red(err.message));
    }
    if (typeof err === "string") {
      console.error(chalk.red(err));
    }

    // console.error(chalk.red(JSON.stringify(err)));

    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    // return super.catch(err);
  }
}
