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


io.on('connection', (socket) => {
  let id = socket.id
  // console.log('user connected', socket)
  // socket.broadcast.emit('userConnected', )
  socket.on('connected', (data) => {
    console.log(data)
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
  socket.on('newBattle', (data) => {
    console.log('Masuk Juga');
  })
  // socket.emit('')
})



http.listen(PORT, () => {
  console.log('server running')
})