const spawn = require('cross-spawn');
const { parseArgsStringToArgv } = require('string-argv');
const kill = require('tree-kill');

const runCommand = (command) => {
  const parts = parseArgsStringToArgv(command);
  const baseCommand = parts[0];
  const args = parts.slice(1);

  const spawnCommand = spawn(baseCommand, args, {
    stdio: 'inherit'
  });

  return {
    kill: () => {
      kill(spawnCommand.pid, 'SIGKILL');
    }
  };
};

module.exports = runCommand;
