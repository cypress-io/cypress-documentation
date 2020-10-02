/* eslint-disable no-console */

const path = require('path')
const chalk = require('chalk')
const Promise = require('bluebird')
const inquirer = require('inquirer')
const minimist = require('minimist')
const debug = require('debug')('deploy')
const questionsRemain = require('@cypress/questions-remain')
const scrape = require('./scrape')
const { shouldDeploy } = require('./should-deploy')
const R = require('ramda')
const la = require('lazy-ass')
const is = require('check-more-types')
const {
  warnIfNotCI,
  getDeployEnvironment,
  checkBranchEnvFolder,
  uploadToS3,
  getBranch,
} = require('@cypress/deploy-bits')

const distDir = path.resolve('public')
const isValidEnvironment = is.oneOf(['production', 'staging'])

function cliOrAsk (property, ask, minimistOptions) {
  // for now isolate the CLI/question logic
  const askRemaining = questionsRemain({
    [property]: ask,
  })
  const options = minimist(process.argv.slice(2), minimistOptions)

  return askRemaining(options).then(R.prop(property))
}

function prompt (questions) {
  return Promise.resolve(inquirer.prompt(questions))
}

function promptToScrape () {
  return prompt({
    type: 'list',
    name: 'scrape',
    message: 'Would you like to scrape the docs? (You only need to do this if they have changed on this deployment)',
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ],
  })
  .get('scrape')
}

const getScrapeDocs = R.partial(cliOrAsk,
  ['scrape', promptToScrape, { boolean: 'scrape' }])

function scrapeDocs (env, branch) {
  debug('scraping documentation')
  console.log('')

  // if we aren't on master do nothing
  if (branch !== 'master') {
    console.log('Skipping doc scraping because you are not on branch:', chalk.cyan('master'))

    return
  }

  // if we arent deploying to production return
  if (env !== 'production') {
    console.log('Skipping doc scraping because you deployed to:', chalk.cyan(env))
    console.log('Only scraping production deploy')

    return
  }

  return getScrapeDocs()
  .then((bool) => {
    if (bool) {
      return scrape()
    }
  })
}

function deployEnvironmentBranch (env, branch) {
  la(is.unemptyString(branch), 'missing branch to deploy', branch)
  la(isValidEnvironment(env), 'invalid deploy environment', env)

  debug('checking branch %s for environment %s', branch, env)
  checkBranchEnvFolder(branch)(env)

  debug('uploading to S3 dist folder %s', distDir)

  return uploadToS3(distDir, env)
  .then(() => scrapeDocs(env, branch))
  .then(() => {
    console.log(chalk.yellow('\n==============================\n'))
    console.log(chalk.bgGreen(chalk.black(' Done Deploying ')))
    console.log('')
  })
}

function doDeploy (env) {
  la(isValidEnvironment(env), 'invalid deploy environment', env)
  debug('getting current branch')

  return getBranch()
  .then((branch) => {
    console.log('deploying branch %s to environment %s',
      chalk.green(branch), chalk.blue(env))

    la(is.unemptyString(branch), 'invalid branch name', branch)

    return deployEnvironmentBranch(env, branch)
  })
}

function deploy () {
  console.log()
  console.log(chalk.yellow('Cypress Docs Deploy'))
  console.log(chalk.yellow('==============================\n'))

  warnIfNotCI()

  return getDeployEnvironment()
  .then((env) => {
    return shouldDeploy(env)
    .then((should) => {
      if (!should) {
        console.log('should NOT deploy to environment %s', env)

        return false
      }

      console.log('should deploy to environment %s', env)

      return doDeploy(env)
    })
  })
}

deploy()
.catch((err) => {
  console.error('🔥  deploy failed')
  console.error(err)
  console.error(err.stack)
  process.exit(-1)
})
