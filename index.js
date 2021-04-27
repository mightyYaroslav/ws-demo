const WebSocket = require('ws')
const EventEmitter = require('events')

const emitter = new EventEmitter()
setTimeout(() => emitter.emit('COIN_BALANCE_CHANGED', 123), 5000)

let id = 0
const clients = {}
const wss = new WebSocket.Server({port: 8080})

wss.on('connection', function connection(ws) {
  const userID = parseInt(ws.upgr.url.substr(1), 10)
  ws.id = id++
  clients[ws.id] = ws
  ws.on('message', function incoming(message) {
    console.log('received: %s', message)
  })
})

emitter.on('COIN_BALANCE_CHANGED', (coins) => {
  for (const [id, client] of Object.entries(clients)) {
    client.send(`New coins balance: ${coins}`)
  }
})
