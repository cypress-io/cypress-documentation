const ffmpeg = require('fluent-ffmpeg')
const debug = require('debug')
const ora = require('ora')

const convert = (inFile, outVid, outImg) => {
  let filesize = 0
  const spinner = ora('Creating .mp4 - 0kB').start()
  return Promise.all([
    new Promise((resolve, reject) => {
      ffmpeg()
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
      .on('error', (...args) => ffError(...args, reject))
      .on('progress', (progress) => {
        filesize = progress.targetSize
        spinner.text = `Creating .mp4 - ${filesize}kB`
      })
    }),
    new Promise((resolve, reject) => {
      ffmpeg(inFile)
      .outputOptions([
        '-r 1/1',
        '-vframes 1',
        '-vf scale=50:25',
      ])
      .save(outImg)
      .on('error', (...args) => ffError(...args, reject))
      .on('end', resolve)

    //ffmpeg -i $filename.mp4 -r 1/1 -vframes 1  $filename.png
    }),
  ])
  .then(() => {
    spinner.stop()
    return filesize
  })
  .catch((err) => {
    spinner.stop()
    throw err
  })


}

module.exports = {
  convert,
}

const ffError = (err, stdout, stderr, reject) => {
  debug('ERROR')
  err.message += `
      ${stdout}
      ${stderr}
      `
  return reject(err)
}

