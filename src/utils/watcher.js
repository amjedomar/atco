const path = require('path');
const chokidar = require('chokidar');

const watcher = (targetDir, callback) => {
  chokidar.watch(
    path.join(targetDir, '**', '*'),
    {
      ignored: (resourcePath, stats) => (stats && stats.isFile()) ? /\.[t|j]s$/i.test(resourcePath): false
    }
  )
    .on('addDir', resourcePatch => {
      callback('addDir', resourcePatch);
    })
    .on('add', resourcePatch => {
      callback('add', resourcePatch);
    })
    .on('change', resourcePatch => {
      callback('change', resourcePatch);
    })
    .on('error', error => {
      throw new Error(error);
    });
};

module.exports = watcher;
