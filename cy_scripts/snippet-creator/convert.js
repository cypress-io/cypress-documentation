const Promise = require('bluebird')
const ffmpeg = require('fluent-ffmpeg')
const debug = require('debug')
const ora = require('ora')

const convert = (inFile, outVid, outImg) => {
  let filesize = 0
  const spinner = ora('Creating .mp4 - 0kB').start()

  return Promise.all([
    new Promise((resolve, reject, onCancel) => {
      const ff = ffmpeg()
      .input(inFile)
      .withNoAudio()
      .videoCodec('libx264')
      .outputFPS(60)
      // .size('1280x720')
      .outputOptions([
        '-crf 26',
      ])
      .save(outVid)
      .on('end', () => {
        debug('successful')

        return resolve()
      })
      .on('error', ffError(reject))
      .on('progress', (progress) => {
        filesize = progress.targetSize
        spinner.text = `Creating .mp4 - ${filesize}kB`
      })

      onCancel(() => ff.kill())
    }),
    new Promise((resolve, reject, onCancel) => {
      // ffmpeg -i $file.mp4 -r 1/1 -vframes 1 $file.png
      const ff = ffmpeg(inFile)
      .outputOptions([
        '-r 1/1',
        '-vframes 1',
        '-vf scale=50:25',
      ])
      .save(outImg)
      .on('error', ffError(reject))
      .on('end', resolve)

      onCancel(() => ff.kill())
    }),
  ])
  .then(() => {
    return filesize
  })
  .catch((err) => {
    throw err
  })
  .finally(() => {
    spinner.stop()
  })
}

module.exports = {
  convert,
}

const ffError = (reject) => {
  return (err, stdout, stderr) => {
    debug('ERROR')
    err.message += `
      ${stdout}
      ${stderr}
      `

    return reject(err)
  }
}
