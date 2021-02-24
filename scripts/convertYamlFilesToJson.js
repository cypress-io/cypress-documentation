const fs = require('fs')
const path = require('path')
const YAML = require('yamljs')
const glob = require('glob')

const convertYamlToJson = (file) => {
  const jsonFile = file.replace('.yml', '.json')
  let data = YAML.load(file)

  /**
   * Prevent array-only JSON files
   */
  if (Array.isArray(data)) {
    const topLevelKey = file
      .slice(file.lastIndexOf('/') + 1)
      .replace('.yml', '')

    data = {
      [topLevelKey]: data,
    }
  }

  const dataToWrite = JSON.stringify(data, null, 2)

  fs.writeFileSync(jsonFile, dataToWrite)
  fs.unlinkSync(file)
}

module.exports.convertYamlFilesToJson = (dir) => {
  const YAML_FILES = '/**/*.yml'
  const files = glob.sync(path.join(dir, YAML_FILES))

  files.forEach(convertYamlToJson)
}
