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


io.on('conection', (socket) => {
  console.log('user connected')
})

http.listen(PORT, () => {
  console.log('server running')
})