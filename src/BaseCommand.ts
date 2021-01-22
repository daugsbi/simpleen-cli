import Command from '@oclif/command'
import chalk from 'chalk'

export default abstract class extends Command {
  
  async catch(err: Error) {
    if(err.message) {
      return console.error(chalk.red(err.message));
    }
    if(typeof err === "string") {
      return console.error(chalk.red(err));
    }

    // console.error(chalk.red(JSON.stringify(err)));

    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    // return super.catch(err);
  }
}