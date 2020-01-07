const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const debug = require('debug')('snippet')
const Confirm = require('prompt-confirm')
const program = require('commander')
const Promise = require('bluebird')

const convert = require('./convert')

Promise.config({
  cancellation: true,
})

const start = (argv) => {
  return Promise.try(() => {
    program
    .option('-d, --debug', 'enable debugging')
    .option('-y, --yes', 'auto agree')
    .usage('Takes path to a video, such as my-video.mp4.')
    .parse(argv)

    if (program.args.length !== 1) {
      return throwKnownError(errors.badArgs(program.args.length))
    }

    if (program.debug) {
      debug.enabled = true
    }

    const [inputFile] = program.args
    const outBaseFile = `source/img/snippets/${removeExtension(path.basename(inputFile))}`
    const outFile = path.resolve(`${outBaseFile}.mp4`)
    const outImg = path.resolve(`${outBaseFile}.png`)

    return Promise.all([fs.pathExists(inputFile), fs.pathExists(outFile)])
    .spread((inExists, outExists) => {
      if (!inExists) {
        debug('file provided was invalid:', inputFile)

        return throwKnownError(errors.inputFileNoExist(inputFile))
      }

      if (outExists && !program.yes) {
        return new Confirm(`Overwrite existing file at: ${chalk.cyan(outFile)}`).run()
      }

      return true
    })
    .then((shouldConvert) => {
      if (shouldConvert) {
        return convert.convert(inputFile, outFile, outImg)
        .then((filesize) => {
          log.log(`Wrote ${filesize}kbs to ${outFile}`)
        })
      }
    })
  })

  .catch(handleKnownErrors)
}

const handleKnownErrors = (err) => {
  let errorText

  if (err.known) {
    errorText = (`[Snippet Creator] Error: ${err.message}`)
  } else {
    errorText = (`[Snippet Creator] Unexpected Error: ${err.message}
    ${err.stack}
    `)
  }

  log.err(errorText)

  return errorText
}

const throwKnownError = (msg) => {
  const err = new Error(msg)

  err.known = true
  throw err
}

const errors = {
  inputFileNoExist: (infile) => `Cannot find input file: ${infile}`,
  badArgs: (num) => `Script takes exactly 1 argument, received ${num}`,
}

const log = {
  /* eslint-disable no-console */
  log (msg) {
    console.log(msg)
  },
  err (msg) {
    console.log(chalk.red(`${msg}`))
  },
}

module.exports = {
  start,
}

function removeExtension (filename) {
  return filename.replace(path.extname(filename), '')
}

// node cy_scripts/snippet-creator/ -d source/img/guides/writing-tests.gif
