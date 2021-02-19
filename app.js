if(process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
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
  socket.on('joinGame', (data) => {
    if (room.length === 0) {
      room.push({
        id: socket.id,
        name: data.name,
        userId: data.id
      })
    } else if (room.length === 1) {
      room.push({
        id: socket.id,
        name: data.name,
        userId: data.id
      })
      let opponent = room[0]
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
    socket.broadcast.emit('enemyRoll', { id: socket.id, dice })
  })

  socket.on('disconnected', () => {
    console.log('masuk', '<<<<<<<<<<<<<<<');
    room = []
    socket.broadcast.emit('enemyLeft')
    console.log(room, 'kondisi client')
  })

  socket.on('disconnect', () => {
    room = room.filter((el) => {
      if(el.id !== socket.id) {
        return el
      }
    })
    socket.broadcast.emit('enemyLeft')
    console.log(room,'kondisi keluar tab/refresh');
    // console.log(room)
  })
  socket.on('refreshLogin', () => {

  })
})

http.listen(PORT, () => {
  console.log('server running')
})