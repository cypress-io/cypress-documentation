const { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } = require('fs')
const path = require('path')

const outputPath = path.join(__dirname, '../../content/_data/toc.json')
const contentPath = path.join(__dirname, '../../content')

// Based on cypress test suites
const targetFiles = {
  api: `${contentPath}/api`,
  examples: `${contentPath}/examples`,
  faq: `${contentPath}/faq`,
  guides: `${contentPath}/guides`
}

const getAllFiles = (dir, arrayOfFiles = []) => {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = `${dir}/${file}`

    if (statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else {
      const pathFile = filePath.split('/content')[1].replace(/\.[^.]*$/, '')

      arrayOfFiles.push(pathFile)
    }
  }

  return arrayOfFiles
}

const getContent = (pathFile) => readFileSync(`${contentPath}${pathFile}.md`).toString()

const createJSON = ({ json, pathFile, content }) => {
  const properties = content
    .trim()
    .split('\n')
    .filter((line) => ((line.startsWith('## ') || line.startsWith('### ')) && !line.includes(`<Icon`))) // keep md headers
    .map((header) => header.replace(/[^a-zA-Z0-9 ]/g, ' ').split(' ').filter(v => v.length > 0 && v[0] === v[0].toUpperCase()).join('-')) // remove `#` in headers
    .filter((header) => header.length > 0)
    
  json[pathFile] = properties

  return json
}

const createTOC = () => {
  const toc = {}

  for (const dir in targetFiles) {
    const json = {}
    const pathFiles = getAllFiles(targetFiles[dir])

    for (const pathFile of pathFiles) {
      const content = getContent(pathFile)

      createJSON({ json, pathFile, content })
    }

    toc[dir] = json
  }

  return toc
}

const writeTOC = (callback) => {
  const toc = createTOC()
  const json = JSON.stringify(toc)

  try {
    if (existsSync(outputPath)) {
      rmSync(outputPath)
    }
  } catch (err) {
    // console.log(err.message)
  } finally {
    writeFileSync(outputPath, `${json}`)
    callback()
  }
}

/*
 ** Basic Plugin Architecture
 ** See https://webpack.js.org/contribute/writing-a-plugin/#basic-plugin-architecture 
 */
class GenerateTOC {
  apply(compiler) {
    const beforeCompile = (params, callback) => writeTOC(callback)

    /*
    ** The main engine that creates a compilation instance
    ** with all the options passed through the CLI or Node API.
    ** See https://webpack.js.org/api/compiler-hooks
    */
    compiler.hooks.beforeCompile.tapAsync('GenerateTOC', beforeCompile)
  }
}

module.exports = { GenerateTOC }
