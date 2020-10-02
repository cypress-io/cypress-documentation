// @ts-check

const debug = require('debug')('copy-english-docs')
const execa = require('execa')
const R = require('ramda')
const pluralize = require('pluralize')
const fs = require('fs-extra')
const Promise = require('bluebird')
const path = require('path')

// work in progress
/* eslint-disable no-console */

const getLanguageName = (short) => {
  const names = {
    ja: 'Japanese',
    'zh-cn': 'Chinese',
    'pt-br': 'Portuguese Brazil',
    'ru': 'Russian',
    'es': 'Spanish',
  }

  if (!names[short]) {
    throw new Error(`Unknown language short name ${short}`)
  }

  return names[short]
}

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

  return findFilesTrackedByGit(sourcesFolderName)
}

const isJapaneseDoc = R.test(/\/ja\//)
const isChineseDoc = R.test(/\/zh-cn\//)
const isPortugueseDoc = R.test(/\/pt-br\//)
const isRussianDoc = R.test(/\/ru\//)
const isSpanishDoc = R.test(/\/es\//)
const isImage = R.test(/\/img\//)
const isTranslation = R.anyPass([isJapaneseDoc, isChineseDoc, isPortugueseDoc, isRussianDoc, isSpanishDoc, isImage])

const translationsFilter = R.reject(isTranslation)

const findAllEnglishDocs = () => {
  debug('finding tracked English docs')

  return findAllDocs().then(translationsFilter).then(removePrefix('source'))
}

/**
 * @param {("ja" | "zh-cn" | "pt-br" | "ru" | "es")} shortName The short language name
 */
const findAllDocsFor = (shortName) => {
  const relativeSourceFolder = `source/${shortName}`

  return findFilesTrackedByGit(relativeSourceFolder).then(removePrefix(relativeSourceFolder))
}

/**
 * @param {("ja" | "zh-cn" | "pt-br" | "ru" | "es")} targetLanguage
 */
const copyAllEnglishDocsNotTranslatedTo = (targetLanguage) => {
  return Promise.all([
    findAllEnglishDocs(),
    findAllDocsFor(targetLanguage),
  ]).then(([englishFiles, translatedFiles]) => {
    return R.difference(englishFiles, translatedFiles)
  })
  .then((untransledEnglishFiles) => {
    if (!untransledEnglishFiles.length) {
      console.log('No untranslated English docs compared to %s', getLanguageName(targetLanguage))

      return
    }

    console.log('Copying %s from English to %s',
      pluralize('file', untransledEnglishFiles.length, true), getLanguageName(targetLanguage))

    console.table(untransledEnglishFiles)

    return Promise.mapSeries(untransledEnglishFiles, (relativePathToEnglishFile) => {
      const sourcePath = path.join('source', relativePathToEnglishFile)
      const destinationPath = path.join('source', targetLanguage, relativePathToEnglishFile)
      const destinationFolder = path.dirname(destinationPath)

      return fs.ensureDir(destinationFolder)
      .then(() => {
        return fs.copyFile(sourcePath, destinationPath)
      })
    })
  })
}

const copyUntranslatedDocs = () => {
  return copyAllEnglishDocsNotTranslatedTo('ja')
  .then(() => {
    return copyAllEnglishDocsNotTranslatedTo('zh-cn')
  }).then(() => {
    return copyAllEnglishDocsNotTranslatedTo('pt-br')
  }).then(() => {
    return copyAllEnglishDocsNotTranslatedTo('ru')
  }).then(() => {
    return copyAllEnglishDocsNotTranslatedTo('es')
  })
}

// allow using module.parent
// @ts-ignore
if (!module.parent) {
  copyUntranslatedDocs()
} else {
  module.exports = {
    copyUntranslatedDocs,
  }
}
