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
  text: 'Добро пожаловать в чат! <br><br><b>#имя_комнаты</b> - подключиться к комнате <br><b>#exit</b> - отключиться'
}

const farewellMessage = {
  text: ":'(",
  img: 'sad.gif'
}

io.on('connection', (socket) => {
  socket.emit('message', greetingMessage)

  socket.on('message', (message) => {
    const messageText = message.trim()

    if (messageText.startsWith('#')) {
      if (messageText == '#exit') {
        socket.emit('message', farewellMessage)
        socket.disconnect()
      } else {
        if (socket.rooms.has(messageText)) {
          socket.emit('message', { text: `Уже в комнате ${messageText}` })
        } else {
          socket.rooms.forEach((room) => {
            if (room.startsWith('#')) socket.leave(room)
          })

          socket.join(messageText)
          socket.emit('message', { text: `Выполнено подключение к ${messageText}` })
        }
      }
    } else {
      socket.rooms.forEach((room) => {
        if (room.startsWith('#')) socket.to(room).emit('message', { text: messageText })
      })
    }
  })
})

httpServer.listen(SOCKET_PORT)
