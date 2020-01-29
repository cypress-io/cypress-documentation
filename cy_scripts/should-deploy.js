'use strict'

const got = require('got')
const git = require('ggit')
const debug = require('debug')('deploy')
const { isEmpty, complement, tap, path, all, equals, T, values } = require('ramda')
const la = require('lazy-ass')
const is = require('check-more-types')
const Promise = require('bluebird')

const docsChanged = complement(isEmpty)

/**
 * Checks if a given environment variable is present
 * and has a string value that can be considered truthy, like
 * "true", "TRUE", "on", "1", "yes"
 *
 * @param {string} name of the environment variable to check
 * @returns boolean
*/
const isEnvVariableOn = (name) => {
  const value = process.env[name]

  if (!value) {
    return false
  }

  return value === 'true'
    || value === 'TRUE'
    || value === 'on'
    || value === '1'
    || value === 'yes'
}
const isForced = process.argv.some(equals('--force')) || isEnvVariableOn('FORCE_DEPLOY')

const isValidEnvironment = is.oneOf(['staging', 'production'])

/* eslint-disable no-console */

/**
 * Checks if current Git branch (develop, master, hot-fix-1)
 * is allowed to deploy to the target environment
 *
 * @param env {string} Target environment, like "staging" or "production"
 */
function isRightBranch (env) {
  la(is.unemptyString(env), 'expected environment name', env)

  // allow multiple branches to deploy to staging environment,
  // add to the keys in this object
  // "my-fix-branch": "staging"
  const branchToEnv = {
    develop: 'staging',
    master: 'production',
  }

  const isDocsToStagingBranch = (branch) => {
    return branch.startsWith('docs-') && env === 'staging'
  }

  const isBranchAllowedToDeploy = (branch) => {
    debug('checking if branch "%s" allowed to deploy?', branch)
    debug('branches to environments %o', branchToEnv)

    if (isDocsToStagingBranch(branch)) {
      console.log('documentation branch %s is allowed to deploy to %s',
        branch, env)

      return true
    }

    const environments = values(branchToEnv)

    debug('checking branches for environments %o', environments)

    if (!environments.includes(env)) {
      console.log('could not get branch for environment', env)

      return false
    }

    debug('target environments include current environment "%s"', env)
    if (env === 'production') {
      const allowed = branchToEnv[branch] === env

      console.log('branch %s is valid for env %s?', branch, env, allowed)

      return allowed
    }

    if (env === 'staging') {
      console.log('branch %s is valid for env %s?', branch, env, true)

      return true
    }

    debug('fell through, returning false')

    return false
  }

  let branch

  return git.branchName()
  .then(tap((name) => {
    console.log('branch name: %s', name)
    branch = name
  }))
  .then(isBranchAllowedToDeploy)
  .then(tap((rightBranch) => {
    console.log('is branch %s allowed to deploy %s?',
      branch, env, rightBranch)
  }))
}

function buildUrlForEnvironment (env) {
  const urls = {
    staging: 'https://docs-staging.cypress.io/build.json',
    production: 'https://docs.cypress.io/build.json',
  }
  const url = urls[env]

  la(url, 'invalid build url for environment', env, url)

  return url
}

function lastDeployedCommit (env) {
  la(is.unemptyString(env), 'missing environment', env)

  const url = buildUrlForEnvironment(env)

  la(url, 'could not get build url for environment', env)

  debug('checking last deploy info using url %s', url)

  return got(url, { json: true })
  .then(path(['body', 'id']))
  .then(tap((id) => {
    console.log('docs last deployed for commit', id)
  }))
}

const changedFilesSince = (branchName) => {
  return (sha) => {
    la(is.unemptyString(branchName), 'missing branch name', branchName)
    debug('finding files changed in branch %s since commit %s', branchName, sha)

    return git.changedFilesAfter(sha, branchName)
    .then(tap((list) => {
      debug('%s changed since last docs deploy in branch %s',
        `${list.length} ${list.length === 1 ? 'file' : 'files'}`, branchName)

      debug(list.join('\n'))
    }))
  }
}

function docsFilesChangedSinceLastDeploy (env, branchName) {
  return lastDeployedCommit(env)
  .then(changedFilesSince(branchName))
  .then(tap((list) => {
    console.log('changed files')
    console.log(list.join('\n'))
    console.log('%d documentation %s changed since last doc deploy',
      list.length, list.length === 1 ? 'file' : 'files')

    console.log('in branch %s against environment %s', branchName, env)
  }))
  .then(docsChanged)
  .then(tap((hasDocumentChanges) => {
    console.log('has document changes?', hasDocumentChanges)
  }))
  .catch(T)
  // if cannot fetch last build, or some other exception
  // then should deploy!
}

// resolves with boolean true/false
function shouldDeploy (env = 'production') {
  la(is.unemptyString(env), 'missing deploy check environment')
  if (!isValidEnvironment(env)) {
    console.log('invalid environment', env)

    return Promise.resolve(false)
  }

  return git.branchName()
  .then((branchName) => {
    debug('checking if should deploy branch %s to environment %s', branchName, env)
    const questions = [
      isRightBranch(env),
      docsFilesChangedSinceLastDeploy(env, branchName),
    ]

    return Promise.all(questions)
    .tap((answers) => {
      debug('answers: %o', answers)
    })
    .then(all(equals(true)))
    .then(Boolean)
    .then((result) => {
      if (isForced) {
        console.log('should deploy is forced!')

        return isForced
      }

      debug('should deploy answers %o', result)

      return result
    })
  })
}

module.exports = {
  shouldDeploy,
  isRightBranch,
}

if (!module.parent) {
  // see list of changed files since last docs deploy
  // lastDeployedCommit()
  //   .then(changedFilesSince)
  //   .then(console.log)
  //   .catch(console.error)

  shouldDeploy('staging')
  .then((should) => {
    console.log('should deploy?', should)
  })
  .catch(console.error)
}
