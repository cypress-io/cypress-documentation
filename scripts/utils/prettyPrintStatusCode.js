const chalk = require('chalk')

module.exports.prettyPrintStatusCode = (statusCode) => {
  if (statusCode >= 400) {
    return chalk.bgRed(`ERROR ⛔️`)
  }

  return chalk.green(`OK ✅`)
}
