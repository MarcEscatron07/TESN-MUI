const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/** refer to .env.local for the correct values **/
// const HOST = '192.168.100.5';
const HOST = 'localhost';
const PORT = 3000;
/** refer to .env.local for the correct values **/

const clientsList = {};

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = socketIo(server, {
    cors: {
      origin: `http://${HOST}:${PORT}`,
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected! ID:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected! ID:', socket.id);

      delete clientsList[socket.id];
      io.emit('clients_list', clientsList);
    });

    // ADD CUSTOM EVENTS HERE
    socket.on('register_client', (clientName) => {
      clientsList[socket.id] = clientName;
      io.emit('clients_list', clientsList);
    });

    socket.on('send_message', ({receiverName}) => {
      const clientSocketId = Object.keys(clientsList).find((id) => clientsList[id] == receiverName);

      if(clientSocketId) {
        io.to(socket.id).emit('receive_message', { senderName: clientsList[socket.id], receiverName: receiverName });
        io.to(clientSocketId).emit('receive_message', { senderName: clientsList[socket.id], receiverName: receiverName });
      } else {
        // temporary way to trigger reload of group chat members
        io.emit('receive_message', { senderName: clientsList[socket.id], receiverName: receiverName });
      }
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Socket Server ready on ${HOST}:${PORT}`);
  });
});
