const log = (...args) => {
  /* eslint-disable no-console */
  console.log('[file-change]', ...args)
}

const onFileChange = ({
  port = 9999,
  hostname = 'localhost',
  pathRegex = /^content\/(.*?)\.md$/,
  getPath = (filepath) => {
    if (pathRegex.test(filepath)) {
      return filepath.replace(pathRegex, '/$1')
    }
  },
  onPath = (path) => log('You need to define an onPath handler!'),
}) => {
  let newPath

  // Adapted from https://gist.github.com/paulirwin/0262cdede91793c2f6b9efab0b369d76
  if (window.__whmEventSourceWrapper) {
    for (let key of Object.keys(window.__whmEventSourceWrapper)) {
      window.__whmEventSourceWrapper[key].addMessageListener((msg) => {
        if (typeof msg.data === 'string' && msg.data.startsWith('{')) {
          const data = JSON.parse(msg.data)

          if (data.action === 'built' && newPath) {
            log('Navigating to:', newPath)
            onPath(newPath)
            newPath = null
          }
        }
      })
    }
  }

  log(`Looking for WebSocket server on ${hostname}:${port}`)
  const socket = new WebSocket(`ws://${hostname}:${port}`)
  let open

  socket.addEventListener('open', () => {
    open = true
    log('Connected to WebSocket server!')
    socket.addEventListener('message', (event) => {
      log('ws', event)
      const { data } = event
      const path = getPath(data)

      if (path) {
        log('File changed:', data)
        log('New path:', path)
        newPath = path
      }
    })
  })

  socket.addEventListener('close', () => {
    if (open) {
      log('Disconnected from WebSocket server!')
    }
  })
}

module.exports = { onFileChange }
