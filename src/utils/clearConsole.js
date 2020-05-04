const clearConsole = () => {
  console.log('\033[2J');
  console.clear();
  console.log();
};

module.exports = clearConsole;
