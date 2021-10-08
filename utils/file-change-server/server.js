/* eslint-disable no-console */

const chokidar = require('chokidar')
const { WebSocketServer } = require('ws')

const host = 'localhost'
const port = 9999
const watchPattern = 'content/**/*.md'
const wss = new WebSocketServer({ host, port })

console.log(`Watching for changes to ${watchPattern}`)
console.log(`WebSocket server started on ${host}:${port}`)
console.log('Waiting for client...')

let ws

wss.on('connection', function connection(_ws) {
  console.log('Client connected!')
  ws = _ws
})

const notifyFile = (path) => {
  if (ws) {
    console.log('Path changed', path)
    ws.send(path)
  }
}

chokidar
  .watch(watchPattern, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  })
  .on('add', notifyFile)
  .on('change', notifyFile)
