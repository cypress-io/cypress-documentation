/**
 * This is an Express server to host the files within the `dist` directory
 * while the app is under test. It is recommended to use this script to
 * serve the app because other servers like `http-server` and python's 
 * `SimpleHTTPServer` will force a redirect and re-add the trailing slash 
 * when the `static/js/removeTrailingSlash.js` script executes on initial
 * page load.
 */
const path = require('path')
const express = require('express')
const fs = require('fs')

const app = express()

const PORT = 3000

const getRequestDuration = start => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

const logger = (req, res, next) => {
  const durationMs = getRequestDuration(process.hrtime())
  const message = `[${(new Date()).toISOString()}] ${req.method}:${req.url} ${res.statusCode} ${durationMs.toLocaleString()} ms`

  // eslint-disable-next-line no-console
  console.log(message)
  next();
}

const DIRECTORY_TO_SERVE = path.join(__dirname, '../dist')

app.use((req, _res, next) => {
  const maybeDirectory = `${DIRECTORY_TO_SERVE}${req.path}`

  if (fs.lstatSync(maybeDirectory).isDirectory()) {
    req.url += '/index.html'
  }

  next()
})

app.use(express.static(DIRECTORY_TO_SERVE, {
  index: 'index.html',
  redirect: false,
  extensions: ['html']
}))

app.use(logger)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}.`)
})
