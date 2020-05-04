const chalk = require('chalk');

const prettifyTsError = (errRaw) => {
  let err = errRaw.replace(/[\n|\r]/g, '');

  // Parse
  let file = err.substring(0, err.indexOf(':'));
  err = err.substring(file.length + 2);

  let pointer = 'error';
  err = err.substring(6);

  let code = err.substring(0, err.indexOf(':'));
  err = err.substring(code.length + 2);

  let description = err;

  // Colorify
  file = chalk.underline.blueBright(file);
  pointer = chalk.redBright(pointer);
  code = chalk.cyan(code);

  // Stringify
  return `${file}: ${pointer} ${code}: ${description}`;
};

module.exports = prettifyTsError;
