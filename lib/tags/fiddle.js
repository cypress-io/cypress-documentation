const path = require('path')
const { stripIndent } = require('common-tags')
const _ = require('lodash')
const requireWithoutCaching = require('require-and-forget')

module.exports = function fiddle (hexo, args) {
  const fiddleFileName = args[0]
  const pathToFiddle = args[1]
  const testPropertyName = args[2] || 'test'

  const fiddlePath = path.join(__dirname, '..', '..', 'cypress', 'fiddles', fiddleFileName)
  let loadedFiddles

  try {
    // to enable editing test files and showing changed pages
    // do not cache loaded JavaScript in the require cache
    loadedFiddles = requireWithoutCaching(fiddlePath)
  } catch (e) {
    /* eslint-disable no-console */
    console.error('Was trying to load fiddle "%s" from file "%s"', pathToFiddle, fiddleFileName)
    console.error('by requiring file "%s"', fiddlePath)
    console.error('but got error', e)
    throw e
  }

  const foundTest = _.get(loadedFiddles, pathToFiddle)

  if (!foundTest) {
    /* eslint-disable */
    console.error('All fiddles from file', fiddlePath)
    console.error(loadedFiddles)

    throw new Error(stripIndent`
      Cannot find fiddle "${pathToFiddle}" in file "${fiddleFileName}"
      file path "${fiddlePath}"
    `)
  }

  // the code block will be later processed using hexo-prism-plugin to have syntax highlighting
  if (!foundTest[testPropertyName]) {
    throw new Error(stripIndent`
      Cannot find property ${testPropertyName} in test object ${foundTest}
    `)
  }
  const escapedCode = _.escape(foundTest[testPropertyName])
  // we could pass custom language names through the tag parameter
  const language = testPropertyName === 'html' ? 'html' : 'javascript'
  return `<pre><code class="${language}">${escapedCode}</code></pre>`
}
