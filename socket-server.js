const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/** refer to .env.local for the correct values **/
const HOST = '192.168.100.25';
// const HOST = 'localhost';
const PORT = 3000;
/** refer to .env.local for the correct values **/

const clientsList = {};
const groupsList = {}

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

      for(const key in groupsList) {
        groupsList[key] = groupsList[key].filter((i) => i != socket.id);

        if(groupsList[key] && groupsList[key].length == 0) {
          delete groupsList[key];
        }
      }
      io.emit('groups_list', groupsList);

      delete clientsList[socket.id];
      io.emit('clients_list', clientsList);
    });

    // ADD CUSTOM EVENTS HERE
    socket.on('register_client', (clientName) => {
      clientsList[socket.id] = clientName;
      io.emit('clients_list', clientsList);
    });

    socket.on('register_group', ({ groups, clientName }) => {
      const clientSocketId = Object.keys(clientsList).find((id) => clientsList[id] == clientName);

      if(groups.length > 0) {
        groups.forEach((item) => {
          if(!groupsList.hasOwnProperty(item.name)) {
            groupsList[item.name] = [clientSocketId];
          } else {
            const clientIdx = groupsList[item.name] ? groupsList[item.name].indexOf(clientSocketId) : -1;

            if(clientIdx == -1) {
              groupsList[item.name] ? groupsList[item.name] = [...groupsList[item.name], clientSocketId] : null;
            }
          }
        })
      }
      
      io.emit('groups_list', groupsList);
    });

    socket.on('send_message', ({receiverName}) => {
      const clientSocketId = Object.keys(clientsList).find((id) => clientsList[id] == receiverName);

      if(clientSocketId) {
        io.to(socket.id).emit('receive_message', { senderName: clientsList[socket.id], receiverName: receiverName });
        io.to(clientSocketId).emit('receive_message', { senderName: clientsList[socket.id], receiverName: receiverName });
      } else {
        if(groupsList.hasOwnProperty(receiverName)) {
          groupsList[receiverName].forEach((item) => {
            io.to(item).emit('receive_message', { senderName: clientsList[socket.id], receiverName: receiverName });
          })
        }
      }
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Socket Server ready on ${HOST}:${PORT}`);
  });
});
