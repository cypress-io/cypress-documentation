const rawRender = require('../raw_render')
const path = require('path')
const { stripIndent } = require('common-tags')
const _ = require('lodash')
const Promise = require('bluebird')

module.exports = function fiddle (hexo, args) {
  /* eslint-disable */
  const fiddleFileName = args[0]
  const pathToFiddle = args[1]

  const render = (str) => {
    return rawRender.call(this, hexo, str, { engine: 'markdown' })
    // return rawRender.call(this, hexo, str)
  }

  const fiddlePath = path.join(__dirname, '..', '..', 'cypress', 'fiddles', fiddleFileName)

  // console.log('loading fiddle "%s"', fiddlePath)

  const loadedFiddles = require(fiddlePath)

  // console.log('loaded fiddles', loadedFiddles)
  const foundTest = _.get(loadedFiddles, pathToFiddle)

  if (!foundTest) {
    console.error('All fiddles from file', fiddlePath)
    console.error(loadedFiddles)

    throw new Error(stripIndent`
      Cannot find fiddle "${pathToFiddle}" in file "${fiddleFileName}"
      file path "${fiddlePath}"
    `)
  }

  console.log('rendering test')
  console.log(foundTest.test)

  const md = `\`\`\`javascript\n${foundTest.test}\n\`\`\`\n`

  // TODO get the render method to use "hexo-prism-plugin"
  // right now for some reason the render does not apply same code blocks
  return Promise.resolve(hexo.render.renderSync({ text: md, engine: 'markdown' }))
  .then((md) => {
    console.log('markdown')
    console.log(md)
  })

  // return render('```javascript\n' + foundTest.test + '\n```\n')
  // return `<pre class="language-javascript"><code class="language-javascript">${foundTest.test}</code></pre>`
}
