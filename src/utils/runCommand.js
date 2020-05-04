const spawn = require('cross-spawn');
const { parseArgsStringToArgv } = require('string-argv');

const runCommand = (command) => {
  const parts = parseArgsStringToArgv(command);
  const baseCommand = parts[0];
  const args = parts.slice(1);

  const spawnCommand = spawn(baseCommand, args, {
    stdio: 'inherit'
  });

  return {
    kill: () => {
      spawnCommand.kill();
    }
  };
};

module.exports = runCommand;
