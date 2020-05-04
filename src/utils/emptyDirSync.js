const path = require('path');
const fs = require('fs');

const emptyDirSync = (dirPath) => {
  fs.readdirSync(dirPath).map(resourceRelativePath => {
    const resourcePath = path.join(dirPath, resourceRelativePath);
    const resourceStat = fs.statSync(resourcePath);

    if (resourceStat.isDirectory()) {
      emptyDirSync(resourcePath);
      fs.rmdirSync(resourcePath);
    } else if (resourceStat.isFile()) {
      fs.unlinkSync(resourcePath);
    }
  });
};

module.exports = emptyDirSync;
