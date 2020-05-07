const path = require('path');
const fs = require('fs');

/**
 * Copy all files (except the excluded ones by extensions) and directories of the specific directory.
 * Then output them in the specific directory.
 * @param {string} src
 * @param {string} dest
 */
const cpdirResourcesSync = (src, dest) => {
  fs.readdirSync(src).map((resource) => {
    const resourceSrcPath = path.join(src, resource);
    const resourceDestPath = path.join(dest, resource);

    const resourceStat = fs.lstatSync(resourceSrcPath);

    if (resourceStat.isDirectory() && !fs.existsSync(resourceDestPath)) {
      fs.mkdirSync(resourceDestPath);
      cpdirResourcesSync(resourceSrcPath, resourceDestPath);
    } else if (resourceStat.isFile()) {
      const isFileExclude = /\.[t|j]s$/i.test(path.extname(resource));

      if (!isFileExclude) fs.copyFileSync(resourceSrcPath, resourceDestPath);
    }
  });
};

module.exports = cpdirResourcesSync;
