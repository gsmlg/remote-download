const express = require('express');
const socket_io = require('socket.io');
const app = express();
const http = require('http');
const server = http.createServer();
const request = require('request');
const setupFrontend = require('./middlewares/frontendMiddleware');
const path = require('path');
const resolve = require('path').resolve;
const appRoot = path.join(__dirname, '..');
const fs = require('fs');
const FILES_PATH = appRoot;

server.on('request', app);

const io = socket_io.listen(server, {
  path: '/webshell/socket.io'
});

// authentication
io.use(function(socket, next) {
  var options = {
    url: 'http://unix:/usr/local/thin.sock:/webshell',
    headers: {
      cookie: socket.request.headers.cookie
    }
  };
  request.get(options, function(err, resp, body){
    if (err || resp.statusCode != 200) {
      next(err);
      socket.disconnect();
    } else {
      socket.sessionUser = JSON.parse(body);
      next();
    }
  });
});

io.on('connection', function(socket) {

  socket.on('switch', function(data){
    var member = data.member;

    socket.emit('switched', {member: member});
    var term = pty.spawn('bash', [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env
    });

    term.on('data', function(data){
      socket.emit('data', data);
    });

    socket.on('data', function(data){
      term.write(data);
    });

    socket.on('disconnect', function() {

    });

  });

});

// In production we need to pass these values in instead of relying on webpack
setupFrontend(app, {
  outputPath: resolve(appRoot, 'build'),
  publicPath: '/',
});



var host = '0.0.0.0', port = 3000;

server.listen(port, host, function(){
  console.log('Server started at '+host+ ':'+port+'.');
});


app.get('/files', (req, res)=> {
  fs.readdir(FILES_PATH, {}, (err, files) => {
    res.send(files.map(file => {
      let stat = fs.statSync(file);
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
        type: type,
      }, stat);
    }));
  });
});
