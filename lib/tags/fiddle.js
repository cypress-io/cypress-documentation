const rawRender = require('../raw_render')
const path = require('path')
const { stripContent } = require('@common-tags')

module.exports = function fiddle (hexo, args) {
  const fiddleFileName = args[0]
  const type = args[1]

  const render = (str) => {
    return rawRender.call(this, hexo, str)
  }

  const fiddlePath = path.join(__dirname, '..', '..', 'cypress', 'fiddles', fiddleFileName)

  console.log('loading fiddle "%s"', fiddlePath)

  const loadedFiddles = require(fiddlePath)

  console.log('loaded fiddles')

  return render(stripContent`
    JavaScript fiddle
  `)
}
