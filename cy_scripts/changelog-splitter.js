// Split a long changelog up into separate files based on md hash
// node changelog-splitter.js changelog.md

const fs = require('fs-extra')
const _ = require('lodash')
const Promise = require('bluebird')

const fileName = process.argv[2]

const content = fs.readFileSync(fileName, 'utf8')
const re = /(^#.+)/gm

const versions = _
.chain(content)
.split(re)
.slice(1)
.chunk(2)
.value()

Promise.map(versions, ([key, value]) => {
  const fileName = `${key.slice(2)}.md`
  const contents = key + value

  return fs.outputFile(fileName, contents)
})
