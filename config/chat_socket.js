
module.exports.chatSockets = (socketServer)=>{
    let io = require('socket.io')(socketServer, {
        cors: {
          origin: 'http://localhost:8000',
          methods: ["GET", "POST"],
          transports: ['websocket', 'polling'],
          credentials: true
        },     
        allowEIO3: true

      });
    
    io.sockets.on('connection', (socket)=>{
        console.log('new connection recieved', socket.id);

        socket.on('disconnect', ()=>{
            console.log('socket disconnected');
        })

        socket.on('join-room', data=>{
          console.log('joining request received', data);
          socket.join(data.chatroom);

          io.in(data.chatroom).emit('user-joined', data.username)

        })

        socket.on('send', data=>{
          console.log(data);
          io.in(data.chatroom).emit('recieve', data);
        })
    })

}





