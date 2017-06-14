const fs = require('fs');
const path = require('path');
const FILES_PATH = path.join(__dirname, '../files');

module.exports = (app) => {
  let {readdir, statSync} = fs;
  let {join} = path;

  app.get('/files', (req, res)=> {
    readdir(FILES_PATH, {}, (err, files) => {
      console.log(files);
      res.send(files.map(file => {
        let stat = statSync(join(FILES_PATH, file));
        let type = null;
        switch(true) {
          case stat.isFile():
            type = 'file';
            break;
          case stat.isDirectory():
            type = 'directory';
            break;
          case stat.isBlockDevice():
            type = 'block';
            break;
          case stat.isCharacterDevice():
            type = 'character';
            break;
          case stat.isSymbolicLink():
            type = 'symbolLink';
            break;
          case stat.isFIFO():
            type = 'fifo';
            break;
          case stat.isSocket():
            type = 'socket';
            break;
        }
        return Object.assign({
          name: file,
          type: type
        }, stat);
      }));
    });
  });

};
