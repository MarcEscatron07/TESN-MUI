const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/** refer to .env.local for the correct values **/
const HOST = 'localhost';
const PORT = 3000;
/** refer to .env.local for the correct values **/

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    // Add your custom events here
    socket.on('message', (msg) => {
      console.log('Message received:', msg);
      socket.broadcast.emit('message', msg);
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Socket Server ready on ${HOST}:${PORT}`);
  });
});
