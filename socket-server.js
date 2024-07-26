const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/** refer to .env.local for the correct values **/
// const HOST = '192.168.100.48';
const HOST = 'localhost';
const PORT = 3000;
/** refer to .env.local for the correct values **/

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = socketIo(server, {
    cors: {
      origin: `http://${HOST}:${PORT}`,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected! ID:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected! ID:', socket.id);
    });

    // ADD CUSTOM EVENTS HERE
    socket.on('send_message', () => {
      io.emit('receive_message');
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Socket Server ready on ${HOST}:${PORT}`);
  });
});
