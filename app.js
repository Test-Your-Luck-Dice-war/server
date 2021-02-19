const express = require('express')
const app = express()
const PORT = 3000
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true
});


let room = []
io.on('connection', (socket) => {
  let id = socket.id

  socket.on('joinGame', (data) => {
    if(room.length === 0) {
      room.push({
        id,
        name: data.name
      })
    } else if (room.length === 1) {
      console.log(room);
      room.push({
        id,
        name: data.name
      })
      let opponent = room[0]
      console.log('masuk if <<<<<<')
      socket.emit('joinsBattle', opponent)
      socket.broadcast.emit('joinsBattle', data)
    } else {
      socket.emit('isRoomFull', true)
    }
  })
  
  socket.on('newMessage', (data) => {
    console.log(data, '<<<  masuk dari client');
    socket.broadcast.emit("serverMessage", data)
  })
  socket.on('battle', (data) => {
    let dice = Math.floor(Math.random() * 6) + 1
    socket.emit('diceRoll', dice)
    socket.broadcast.emit('enemyRoll', {id, dice})
  })

  socket.on('disconnected', () => {
    console.log('masuk', '<<<<<<<<<<<<<<<');
    room = []
    socket.broadcast.emit('enemyLeft')
    // console.log(room)
  })

  socket.on('disconnect', (val) => {
    console.log(val);
    room = room.filter((el) => {
      if(el.id !== id) {
        return el
      }
    })
    socket.broadcast.emit('enemyLeft')
    // console.log(room)
  })
  // socket.on('newBattle', (data) => {
  //   console.log('Masuk Juga');
  // })
  // socket.emit('')
})



http.listen(PORT, () => {
  console.log('server running')
})