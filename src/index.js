#!/usr/bin/env node

const {targetDir, outDir, args, typescriptArgv} = require('./initialization/initialize');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
const runCommand = require('./utils/runCommand');
const prettifyTsError = require('./utils/prettifyTsError');
const watcher = require('./utils/watcher');
const cpdirResourcesSync = require('./utils/cpdirResourcesSync');
const logNote = require('./tools/logNote')(args);

logNote.running();

let compileLastStatus = 'running';
const copyStatuses = [];
let errors = [];

// Copy & Compile Handler
let spawnTask;

const cokying = () => {
  const statuses = [
    copyStatuses.includes('running') ? 'running' : 'success',
    compileStatus
  ];

  if (statuses.includes('running')) {
    if (compileLastStatus !== 'running') {
      process.exitCode = 0;

      if (spawnTask && args.watch) {
        spawnTask.kill();
        spawnTask = '';
      }

      logNote.running();
      compileLastStatus = 'running';
    }
  }

  else if (compileLastStatus === 'running') {
    if (statuses.includes('failed')) {
      process.exitCode = 1;

      errors.forEach(error => {
        console.error('\n' + error);
      });

      logNote.failed(errors.length);
      errors = [];
      compileLastStatus = 'failed';
    } else {
      logNote.success();
      if (args.exec) spawnTask = runCommand(args.exec);
      compileLastStatus = 'success';
    }
  }
};

// Compile Typescript
let compileStatus = 'running';

const compileCommand = 'tsc ' + typescriptArgv;

if (args.watch) {
  const compile = exec(compileCommand, (err, stdout) => {
    if (err) {
      console.log(stdout);
      process.exit(1);
    }
  });

  compile.stdout.on('data', (stdout) => {
    if (stdout.substring(1) !== 'c') {
      stdout.split('\r\n').filter(e => e.length > 0).forEach(msg => {
        const note = msg.substring(msg.indexOf('-') > -1 ? msg.indexOf('-') + 2 : msg.length).trim();

        if (
          note === 'Starting compilation in watch mode...' ||
          note === 'File change detected. Starting incremental compilation...'
        ) {
          compileStatus = 'running';
          cokying();
        } else if (note === 'Found 0 errors. Watching for file changes.') {
          compileStatus = 'success';
          cokying();
        } else if (
          note.startsWith('Found ') && note.includes(' error') && note.endsWith('. Watching for file changes.')
        ) {
          compileStatus = 'failed';
          cokying();
        } else {
          errors.push(prettifyTsError(msg));
        }
      });
    }
  });
} else {
  exec(compileCommand, (failed, stdout) => {
    if (failed) {
      if (stdout.startsWith('error')) {
        console.log(stdout);
        process.exit(1);
      }

      const errorsRaw = stdout.split('\r\n');
      errorsRaw.pop();
      errors = errorsRaw.map(errorRaw => prettifyTsError(errorRaw));
      compileStatus = 'failed';
      cokying();
    } else {
      compileStatus = 'success';
      cokying();
    }
  });
}

// Copy files
if (args.copyOthers) {
  // for watch mode only
  if (args.watch) {
    watcher(targetDir, async (event, targetPath) => {
      const relativePath = path.relative(targetDir, targetPath);
      const outPath = path.join(outDir, relativePath)
      const index = copyStatuses.length + 1;

      copyStatuses[index] = 'running';
      cokying();

      if (event === 'addDir') {
        fs.mkdirSync(outPath);
      } else if (event === 'add' || event === 'change') {
        await fs.promises.copyFile(targetPath, outPath);
      }

      copyStatuses[index] = 'success';
      cokying();
    });
  } else {
    copyStatuses[0] = 'running';
    cpdirResourcesSync(targetDir, outDir);
    copyStatuses[0] = 'success';
    cokying();
  }
}
