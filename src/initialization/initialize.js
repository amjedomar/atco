const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const isObj = require('../utils/isObj');
const isArray = require('../utils/isArray');
const { args, typescriptArgv } = require('./parseArgv');
const emptyDirSync = require('../utils/emptyDirSync');

// helpers
const logErr = (message, includeDefaultWords = true) => {
  if (includeDefaultWords) {
    console.error(
      chalk.redBright('In') +
      ' ' +
      chalk.underline.blueBright('tsconfig.json') +
      ' ' +
      chalk.redBright(message)
    );
  } else {
    console.error(
      chalk.redBright(message)
    );
  }

  process.exit(1);
};

// Get Typescript Config
let config;

try {
  config = fs.readFileSync(
    path.join(process.cwd(), 'tsconfig.json')
  );
} catch (e) {
  logErr('In project root "tsconfig.json" file not exists', false);
}

try {
  config = JSON.parse(config);
} catch (e) {
  logErr('JSON syntax is invalid');
}

// Check "include[0]" value
if (!isObj(config) || !isArray(config.include)) {
  logErr('You have to assign array value to "include"');
}

if (config.include.length === 0) {
  logErr('You have to assign string value to "include[0]"');
}

if (config.include.length > 1) {
  logErr('Currently "atsco" package not support assign more than on value to "include"');
}

if (config.include[0].endsWith('/**/*') === false) {
  logErr('"include[0]" should ends with "/**/*"');
}

let targetDir = path.join(
  process.cwd(),
  config.include[0].substring(0, config.include[0].length - 5)
);

if (path.join(process.cwd(), '/') === path.join(targetDir, '/')) {
  logErr('"include[0]" value is invalid');
}

try {
  if (fs.lstatSync(targetDir).isDirectory() === 'false') {
    logErr('the target directory which specified in "include[0]" not exists');
  }
} catch (e) {
  logErr('target directory which specific in "include[0]" not exists');
}

// Check "compilerOptions.outDir" value
if (!isObj(config.compilerOptions) || typeof config.compilerOptions.outDir !== 'string') {
  logErr('You have to assign string value to "compilerOptions.outDir"');
}

let outDir = path.join(
  process.cwd(),
  config.compilerOptions.outDir
);

if (path.join(process.cwd(), '/') === path.join(outDir, '/')) {
  logErr('"compilerOptions.outDir" value is invalid');
}

const isOutDirExists = fs.existsSync(outDir);

try {
  if (args.cleanOutDir && isOutDirExists) emptyDirSync(outDir);
} catch (e) {
  logErr('cannot access output directory because it is being used by another application', false);
}

try {
  if (!isOutDirExists) fs.mkdirSync(outDir, { recursive: true });
} catch (e) {
  logErr('cannot access output directory because it is being used by another application', false);
}

if (path.join(targetDir, '/') === path.join(outDir, '/')) {
  logErr('there is conflict because "include[0]" value is equal to "compilerOptions.outDir" value')
}

module.exports = {
  targetDir,
  outDir,
  args,
  typescriptArgv
};
