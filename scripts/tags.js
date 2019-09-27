/* global hexo */
/* eslint-disable object-shorthand */

const _ = require('lodash')
const Promise = require('bluebird')
const beepAndLog = require('../lib/beep')
const partial = require('../lib/tags/partial')
const note = require('../lib/tags/note')
const yields = require('../lib/tags/yields')
const requirements = require('../lib/tags/requirements')
const assertions = require('../lib/tags/assertions')
const timeouts = require('../lib/tags/timeouts')
const typedoc = require('../lib/tags/typedoc')
const usageOptions = require('../lib/tags/usage')
const { issue, PR, openAnIssue, user } = require('../lib/tags/github')
const { badge } = require('../lib/tags/badge')
const { url, urlHash } = require('../lib/tags/url')
const { fa, helperIcon } = require('../lib/tags/icons')
const video = require('../lib/tags/video')
const imgTag = require('../lib/tags/image')
const changelog = require('../lib/tags/changelog')
const history = require('../lib/tags/history')
const aliases = require('../lib/tags/aliases')

const tags = {
  aliases,

  assertions,

  badge,

  changelog,

  // icons
  fa,
  helper_icon: helperIcon,
  
  // images
  imgTag,

  // github links
  issue,
  open_an_issue: openAnIssue,
  PR,
  user,

  partial,

  requirements,

  timeouts,

  typedoc,

  // url
  url,
  urlHash,

  usage_options: usageOptions,

  // video
  video,

  yields,
}

// tags which require ending
const endingTags = {
  history,

  note,
}

function promisify (fn) {
  // partial in hexo as 1st argument
  fn = _.partial(fn, hexo)

  // return higher order function
  return function () {
    // call with up hexo context
    /* eslint-disable prefer-rest-params */
    return Promise.resolve(fn.apply(this, arguments))
    .catch(beepAndLog)
  }
}

_.each(tags, (fn, key) => {
  // make all regular tags async and provide 'hexo' as the first argument
  hexo.extend.tag.register(key, promisify(fn), { async: true })
})

_.each(endingTags, (fn, key) => {
  // make all ending tags async and provide 'hexo' as the first argument
  hexo.extend.tag.register(key, promisify(fn), { async: true, ends: true })
})
