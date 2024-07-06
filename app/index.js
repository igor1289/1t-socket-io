import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

const HTTP_PORT = 3000
const SOCKET_PORT = 3001

app.get('/', async (req, res) => {
  return res.send(123)
})

app.listen(HTTP_PORT, async () => {
  console.log('Server started')
})

const greetingMessage = {
  text: 'Добро пожаловать в чат-попугай! <br> Он будет повторять всё что вы напишите<br><br>/exit - отключиться'
}

const farewellMessage = {
  text: ":'(",
  img: 'sad.gif'
}

io.on('connection', (socket) => {
  socket.emit('message', greetingMessage)

  socket.on('message', (message) => {
    if (message != '/exit') {
      socket.emit('message', { text: message })
    } else {
      socket.emit('message', farewellMessage)
      socket.disconnect()
    }
  })
})

httpServer.listen(SOCKET_PORT)
