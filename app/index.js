import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5174'
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

io.on('connection', (socket) => {
  console.log(`Подключен клиент`, socket)
})

httpServer.listen(SOCKET_PORT)
