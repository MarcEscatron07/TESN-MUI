const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const SOCKET_PORT = process.env.PORT || 3000; // must be the same with .env.local > NEXT_PUBLIC_SOCKET_PORT

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

  server.listen(SOCKET_PORT, (err) => {
    if (err) throw err;
    console.log(`> Socket Server ready on port:${SOCKET_PORT}`);
  });
});
