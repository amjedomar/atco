let argv = process.argv.slice(2);

// Step 1: Exclude not allowed args
const notAllowedArgs = ['--project', '-p', '--version', '--help'];

notAllowedArgs.map(notAllowedArg => {
  const notAllowedArgKeyIndex = argv.lastIndexOf(notAllowedArg);
  const notAllowedArgVal = argv[notAllowedArgKeyIndex + 1];

  if (notAllowedArgKeyIndex >= 0) {
    argv.splice(notAllowedArgKeyIndex, 1);

    if (typeof notAllowedArgVal !== 'undefined' && !notAllowedArgVal.startsWith('-')) {
      argv.splice(notAllowedArgKeyIndex, 1);
    }
  }
});

// Step 2: Extract atco args
const args = {}, errors = [];

/**
 *
 * @type {{name: string, type: string, alias?: string, default?: *, isCommon?: boolean}[]}
 */
const argsSchema = [
  {
    name: 'copyOthers',
    type: 'boolean',
    default: true
  },
  {
    name: 'exec',
    type: 'string',
  },
  {
    name: 'cleanOutDir',
    type: 'boolean',
    default: true
  },
  {
    name: 'watch',
    type: 'boolean',
    alias: 'w',
    default: false,
    isCommon: true
  }
];

argsSchema.map(argSchema => {
  let argKeyIndex = argv.lastIndexOf('--' + argSchema.name);
  if (argSchema.hasOwnProperty('alias')) {
    const aliasArgKeyIndex = argv.lastIndexOf('-' + argSchema.alias);
    if (aliasArgKeyIndex > argKeyIndex) argKeyIndex = aliasArgKeyIndex;
  }

  const argVal = argv[argKeyIndex + 1];

  if (argKeyIndex < 0) {
    if (argSchema.hasOwnProperty('default')) {
      args[argSchema.name] = argSchema.default;
    }
  } else {
    if (argVal === undefined || argVal.startsWith('-')) {
      if (argSchema.type === 'string') args[argSchema.name] = '';
      if (argSchema.type === 'boolean') args[argSchema.name] = true;
      if (argSchema.type === 'number') args[argSchema.name] = undefined;

      if (!argSchema.isCommon) {
        argv.splice(argKeyIndex, 1);
      }
    } else {
      // Check
      let isValid = false;

      if (argSchema.type === 'boolean') {
        if (argVal === 'true' || argVal === 'false') {
          isValid = true;
        } else {
          errors.push(`error: value of argument "${argv[argKeyIndex]}" should be "true" or "false"`);
        }
      } else if (argSchema.type === 'number') {
        if (/^[0-9]*$/.test(argVal)) {
          isValid = true;
        } else {
          errors.push(`error: value of argument "${argv[argKeyIndex]}" should be number`);
        }
      } else if (argSchema.type === 'string') {
        isValid = true;
      }

      // Set
      if (isValid) {
        if (argSchema.type === 'string') args[argSchema.name] = argVal;
        if (argSchema.type === 'boolean') args[argSchema.name] = argVal === 'true';
        if (argSchema.type === 'number') args[argSchema.name] = Number(argVal);

        if (!argSchema.isCommon) {
          argv.splice(argKeyIndex, 1);
          argv.splice(argKeyIndex, 1);
        }
      }
    }
  }
});

if (errors.length > 0) {
  errors.forEach(error => {
    console.error(error);
  });

  process.exit(1);
}

// Step 3: Extract typescript args
let typescriptArgv = '';
if (argv.length > 0) {
  typescriptArgv = argv.map(item => `"${item}"`).reduce((items, item) => items + ' ' + item);
}

// Export
module.exports = {
  args,
  typescriptArgv
};
