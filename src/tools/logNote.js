const chalk = require('chalk');
const clearConsole = require('../utils/clearConsole');
const formatDate = require('../utils/formatDate');

const logNote = (args) => {
  const notes = {};

  notes.running = () => {
    if (args.watch) clearConsole();

    let date = formatDate(new Date);

    console.log(
      (args.watch ? (chalk.gray(`[${date}]`) + ' ') : '') +
      'Running...'
    );
  };

  notes.success = () => {
    console.log();

    if (args.watch) {
      console.log(
        chalk.gray(`[${formatDate(new Date)}]`) +
        ' ' +
        chalk.greenBright('Found 0 error. Watching for file changes.')
      );
    } else {
      console.log(chalk.greenBright('Done Successfully'));
    }
  };

  notes.failed = (errorsLength) => {
    console.log();

    let date = formatDate(new Date);

    console.log(
        (args.watch ? (chalk.gray(`[${date}] `) + ' ') : '') +
        chalk.redBright(
          `Found ${errorsLength} error.` +
          (args.watch ? ' Watching for file changes.' : '')
        )
    );
  };

  return notes;
};


module.exports = logNote;
