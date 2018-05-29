const program = require('commander')
const chalk = require('chalk')
const fs = require('fs-extra')
const debug = require('debug')('snippet')
const path = require('path')
const Confirm = require('prompt-confirm')


const convert = require('./convert')

global.Promise = require('bluebird')

const start = (argv) => {
  return Promise.try(() => {

    program
    .option('-d, --debug', 'enable debugging')
    .option('-y, --yes', 'auto agree')
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
    .then(([inExists, outExists]) => {

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
          Log.log(`Wrote ${filesize}kbs to ${outFile}`)
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
  Log.err(errorText)
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

const Log = {
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
  return filename.replace(/\.[^/.]+$/, '')
}

// node cy_scripts/snippet-creator/ -d source/img/guides/writing-tests.gif
