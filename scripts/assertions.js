const { codify } = require('./customTagUtils')

const createNoneListItems = (cmd) => {return [
  `${codify(cmd)} cannot have any assertions chained.`,
]}

const createWaitListItem = (cmd) =>
  {return `${codify(
    cmd
  )} will automatically wait for assertions you have chained to pass`}

const createWaitListItems = (cmd) => [createWaitListItem(cmd)]

const createRetryListItem = (cmd) =>
  {return `${codify(
    cmd
  )} will automatically {% url "retry" retry-ability %} until all chained assertions have passed`}

const createRetryListItems = (cmd) => [createRetryListItem(cmd)]

const createInvokeListItems = (cmd) => {return [
  `${codify(cmd)} will wait for the ${codify(
    'function'
  )} to exist on the subject before running.`,
  `${codify(cmd)} will wait for the promise to resolve if the invoked ${codify(
    'function'
  )} returns a promise.`,
  createRetryListItem(cmd),
]}

const createOnceListItems = (cmd) => {return [
  `${codify(
    cmd
  )} will only run assertions you have chained once, and will not {% url "retry" retry-ability %}.`,
]}

const createUtilityListItems = (cmd) => {return [
  `${codify(cmd)} is a utility command.`,
  `${codify(
    cmd
  )} will not run assertions. Assertions will pass through as if this command did not exist.`,
]}

const createItsListItems = (cmd) => {return [
  `${codify(
    cmd
  )} will automatically {% url "retry" retry-ability %} until it has a property that is not ${codify(
    'null'
  )} or ${codify('undefined')}.`,
]}

const createExistListItem = (cmd) =>
  {return `${codify(
    cmd
  )} will automatically {% url "retry" retry-ability %} until the element(s) {% url "exist in the DOM" introduction-to-cypress#Default-Assertions %}`}

const createExistenceListItems = (cmd) => {return [
  createExistListItem(cmd),
  createRetryListItem(cmd),
]}

const createShadowDomExistenceListItems = (cmd) => {return [
  createExistListItem(cmd),
  `${codify(
    cmd
  )} will automatically {% url "retry" retry-ability %} until the element(s) host(s) a shadow root.`,
  createRetryListItem(cmd),
]}

const createActionsListItems = (cmd) => {return [
  `${codify(
    cmd
  )} will automatically wait for the element to reach an {% url "actionable state" interacting-with-elements %}`,
  createRetryListItem(cmd),
]}

const createWrapListItems = (cmd) => {return [
  `${codify(
    cmd
  )}, when its argument is a promise, will automatically wait until the promise resolves. If the promise is rejected, ${codify(
    cmd
  )} will fail the test.`,
  createRetryListItem(cmd),
]}

/**
 * { key: string, value: (cmd: string) => string[] }
 */
const CREATE_ASSERTION_LIST_ITEMS_MAP = {
  none: createNoneListItems,
  wait: createWaitListItems,
  retry: createRetryListItems,
  invoke: createInvokeListItems,
  once: createOnceListItems,
  utility: createUtilityListItems,
  its: createItsListItems,
  existence: createExistenceListItems,
  shadow_dom_existence: createShadowDomExistenceListItems,
  actions: createActionsListItems,
  wrap: createWrapListItems,
}

/**
 * Creates content that should appear in list items for a given assertion
 * @returns string[]
 */
module.exports.createAssertionListItems = (type, cmd) => {
  const buildAssertionListItems = CREATE_ASSERTION_LIST_ITEMS_MAP[type]

  if (!buildAssertionListItems) {
    throw new Error(
      `{% assertions %} tag helper was provided an invalid option: ${cmd}`
    )
  }

  const executedCmd = `${cmd}()`

  return buildAssertionListItems(executedCmd)
}
