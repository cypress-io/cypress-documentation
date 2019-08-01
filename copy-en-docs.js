const debug = require('debug')('copy-en-docs')
const execa = require('execa')
const R = require('ramda')

// work in progress

const findFilesTrackedByGit = (folder) => {
  return execa('git', ['ls-files', folder]).then(R.prop('stdout')).then(R.split('\n'))
}

const removePrefix = (prefix) => {
  const n = prefix.length + 1 // prefix + "/"

  const remove = (relativeFilename) => {
    return R.startsWith(prefix, relativeFilename) ? relativeFilename.substr(n) : relativeFilename
  }

  return R.map(remove)
}

const findAllDocs = () => {
  debug('finding all docs')

  const sourcesFolderName = 'source'
  // const n = sourcesFolderName.length + 1 // source + "/"

  // const removeSourcePrefix = (relativeFilename) => {
  //   return R.startsWith('source', relativeFilename) ? relativeFilename.substr(n) : relativeFilename
  // }

  return findFilesTrackedByGit(sourcesFolderName)
}

const isJapaneseDoc = R.test(/\/ja\//)
const isChineseDoc = R.test(/\/zh-cn\//)
const isImage = R.test(/\/img\//)
const isTranslation = R.anyPass([isJapaneseDoc, isChineseDoc, isImage])

const translationsFilter = R.reject(isTranslation)

const findAllEnglishDocs = () => {
  debug('finding tracked English docs')

  return findAllDocs().then(translationsFilter).then(removePrefix('source'))
}

const findAllJapaneseDocs = () => {
  return findFilesTrackedByGit('source/ja').then(removePrefix('source/ja'))
}

const findAllEnglishDocsNotTranslatedToJapanese = () => {
  return Promise.all([
    findAllEnglishDocs(),
    findAllJapaneseDocs(),
  ]).then(([englishFiles, translatedFiles]) => {
    // console.dir(englishFiles.slice(0, 10))
    // console.dir(englishFiles)
    // console.dir(translatedFiles.slice(0, 10))
    return R.difference(englishFiles, translatedFiles)
  })
  // eslint-disable-next-line no-console
  .then(console.dir)
}

// findAllJapaneseDocs().then(console.table, console.error)
findAllEnglishDocsNotTranslatedToJapanese()
// module.exports = {translationsFilter}
