const { codify } = require('./customTagUtils')

const URL_MAP = {
  action: `{% url 'actionable state' interacting-with-elements %}`,
  exist: `{% url 'exist in the DOM' introduction-to-cypress#Default-Assertions %}`,
  retry: `{% url 'retry' retry-ability %}`
}

const createAssertionListItem = cmd => `${codify(cmd)} can time out waiting for assertions you've added to pass.`
const createPromiseListItem = cmd => `${codify(cmd)} can time out waiting for a promise you've returned to resolve.`

const createAssertionsListItems = cmd => [
  createAssertionListItem(cmd)
]

const createActionsListItems = cmd => [
  `${codify(cmd)} can time out waiting for the element to reach an ${URL_MAP.action}.`,
  createAssertionListItem(cmd)
]

const createExistenceListItems = cmd => [
  `${codify(cmd)} can time out waiting for the element(s) to ${URL_MAP.exist}.`,
  createAssertionListItem(cmd)
]

const createShadowDOMExistenceListItems = cmd => [
  `${codify(cmd)} can time out waiting for the element(s) to ${URL_MAP.exist}.`,
  `${codify(cmd)} can time out waiting for the element(s) to host a shadow root.`,
  createAssertionListItem(cmd)
]

const createAutomationListItems = cmd => [
  `${codify(cmd)} should never time out.`,
  // TODO
  `{% note warning %}
Because ${codify(cmd)} is asynchronous it is technically possible for there to be a timeout while talking to the internal Cypress automation APIs. But for practical purposes it should never happen.
{% endnote %}`
]

const createItsListItems = cmd => [
  `${codify(cmd)} can time out waiting for the property to exist.`,
  createAssertionListItem(cmd)
]

const createExecListItems = cmd => [
  `${codify(cmd)} can time out waiting for the system command to exist.`
]

const createTaskListItems = cmd => [
  `${codify(cmd)} can time out waiting for the task to end.`
]

const createNoneListItems = cmd => [
  `${codify(cmd)} cannot time out.`
]

const createPageListItems = cmd => [
  `${codify(cmd)} can time out waiting for the page to fire its ${codify('load')} event.`,
  createAssertionListItem(cmd)
]

const createRequestListItems = cmd => [
  `${codify(cmd)} can time out waiting for the server to respond.`
]

const createWaitListItems = cmd => [
  `${codify(cmd)} can time out waiting for the request to go out.`,
  `${codify(cmd)} can time out waiting for the response to return.`
]

const createPromisesListItems = cmd => [
  createPromiseListItem(cmd)
]

const createTimeoutsListItems = cmd => [
  `${codify(cmd)} will continue to ${URL_MAP.retry} its specified assertions until it times out.`
]

const createInvokeListItems = cmd => [
  createAssertionListItem(cmd),
  createPromiseListItem(cmd)
]


const CREATE_TIMEOUTS_LIST_ITEMS_MAP = {
  assertions: createAssertionsListItems,
  actions: createActionsListItems,
  existence: createExistenceListItems,
  shadow_dom_existence: createShadowDOMExistenceListItems,
  automation: createAutomationListItems,
  its: createItsListItems,
  exec: createExecListItems,
  task: createTaskListItems,
  none: createNoneListItems,
  page: createPageListItems,
  request: createRequestListItems,
  wait: createWaitListItems,
  promises: createPromisesListItems,
  timeouts: createTimeoutsListItems,
  invoke: createInvokeListItems
}

module.exports.createTimeoutsListItems = (type, cmd) => {
  const buildTimeoutsListItems = CREATE_TIMEOUTS_LIST_ITEMS_MAP[type]
  if (!buildTimeoutsListItems) {
    throw new Error(`{% timeouts %} tag helper was provided an invalid option: ${type}`)
  }
  const executedCmd = `${cmd}()`
  return buildTimeoutsListItems(executedCmd)
}
