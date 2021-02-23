const { codify } = require('./customTagUtils')

// util
const maybeAppendContent = (content) => content ? ` ${content}` : ''

const assertion = (cmd) => [`In most cases, ${codify(cmd)} yields the same subject it was given from the previous command.`]

const sameSubject = (cmd) => [`${codify(cmd)} yields the same subject it was given from the previous command.`]

const changesSubject = (cmd, content) => [`${codify(cmd)}${content ? ` ${content}` : ''}`]

const maybeChangesSubject = (cmd, content) => [
  `${codify(cmd)}${maybeAppendContent(content)}`,
  `${codify(cmd)} wll not change the subject if ${codify('null')} or ${codify('undefined')} is returned.`
]

const setsSubject = (cmd, content) => [
  `${codify(cmd)}${maybeAppendContent(content)}`
]

const changesDomSubject = (cmd) => [
  `${codify(cmd)} yields the new DOM element it found.`
]

const changesDomSubjectOrSubjects = (cmd) => [
  `${codify(cmd)} yields the new DOM element(s) it found.`
]

const setsDomSubject = (cmd) => [
  `${codify(cmd)} yields the DOM element(s) it found.`
]

const yieldsNull = (cmd) => [
  `${codify(cmd)} yields ${codify('null')}.`,
  `${codify(cmd)} cannot be chained further.`
]

const yieldsAliasableNull = (cmd) => [
  `${codify(cmd)} yields ${codify('null')}.`,
  `${codify(cmd)} can be aliased, but otherwise cannot be chained further.`
]

const CREATE_YIELDS_LIST_ITEMS_MAP = {
  same_subject: sameSubject,
  changes_subject: changesSubject,
  maybe_changes_subject: maybeChangesSubject,
  changes_dom_subject: changesDomSubject,
  changes_dom_subject_or_subjects: changesDomSubjectOrSubjects,
  sets_dom_subject: setsDomSubject,
  sets_subject: setsSubject,
  null: yieldsNull,
  null_alias: yieldsAliasableNull,
  assertion_indeterminate: assertion
}

/**
 * Creates content that should appear in list items for a given "yields" 
 * @returns string[]
 */
module.exports.createYieldsListItems = (type, cmd, content) => {
  const buildYieldsListItems = CREATE_YIELDS_LIST_ITEMS_MAP[type]
  if (!buildYieldsListItems) {
    throw new Error(`{% yields %} tag helper was provided an invalid option: ${type}`)
  }
  const executedCmd = `${cmd}()`
  return buildYieldsListItems(executedCmd, content)
}
