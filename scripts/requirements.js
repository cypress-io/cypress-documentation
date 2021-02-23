const { codify } = require('./customTagUtils')

const createFocusListItem = (cmd) =>
  `${codify(cmd)} requires the element to be able to receive focus.`
const createChildCommandListItem = (cmd) =>
  `${codify(cmd)} requires being chained off a previous command.`
const createChildCommandDOMListItem = (cmd) =>
  `${codify(
    cmd
  )} requires being chained off a command that yields DOM element(s).`
const createDualCommandListItem = (cmd) =>
  `${codify(cmd)} can bechained off of ${codify('cy')} or off another command.`
const createParentCommandListItem = (cmd) =>
  `${codify(cmd)} requires being chained off of ${codify('cy')}.`

const createBlurabilityListItems = (cmd) => [
  createChildCommandDOMListItem(cmd),
  `${codify(cmd)} requires the element to currently have focus.`,
  createFocusListItem(cmd),
]

const createChildListItems = (cmd) => [createChildCommandListItem(cmd)]

const createCheckabilityListItems = (cmd) => [
  createChildCommandDOMListItem(cmd),
  `${codify(cmd)} requires the element to have type ${codify(
    'checkbox'
  )} or ${codify('radio')}.`,
]

const createClearabilityListItems = (cmd) => [
  createChildCommandDOMListItem(cmd),
  `${codify(cmd)} requires the element to be an ${codify('input')} or ${codify(
    'textarea'
  )}.`,
]

const createDOMListItems = (cmd) => [
  cmd === 'cy.get' || cmd === 'cy.focused'
    ? createParentCommandListItem(cmd)
    : createChildCommandDOMListItem(cmd),
]

const createDualListItems = (cmd) => [createDualCommandListItem(cmd)]

const createDualExistenceListItems = (cmd) => [
  `${codify(cmd)} can be chained off of ${codify(
    'cy'
  )} or off a command that yields DOM element(s).`,
]

const createDualExistenceSingleDOMListItems = (cmd) => [
  `${codify(cmd)} can be chained off of ${codify(
    'cy'
  )} or off a command that yields a single DOM element.`,
]

const createExecListItems = (cmd) => [
  createParentCommandListItem(cmd),
  `${codify(cmd)} requires the executed system command to eventually exit.`,
  `${codify(cmd)} requires that the exit code be ${codify('0')} when ${codify(
    'failOnNonZeroExit'
  )} is ${codify('true')}.`,
]

const createFocusabilityListItems = (cmd) => [
  createChildCommandDOMListItem(cmd),
  createFocusListItem(cmd),
]

const createNoneListItems = (cmd) => [
  `${codify('none')} has no requirements or default assertions.`,
]

const createParentListItems = (cmd) => [createParentCommandListItem(cmd)]

const createPageListItems = (cmd) => [
  createParentCommandListItem(cmd),
  `${codify(cmd)} requires the response to be ${codify(
    'content-type: text/html'
  )}.`,
  `${codify(cmd)} requires the response code to be ${codify(
    '2xx'
  )} after following redirects.`,
  `${codify(cmd)} requires the load ${codify(
    'load'
  )} event to eventually fire.`,
]

const createReadFileListItems = (cmd) => [
  createParentCommandListItem(cmd),
  `${codify(cmd)} requires the file must exist.`,
  `${codify(cmd)} requires the file be successfully read from disk.`,
]

const createRequestListItems = (cmd) => [
  createParentCommandListItem(cmd),
  `${codify(cmd)} requires that the server send a response.`,
  `${codify(cmd)} requires that the response status code be ${codify(
    '2xx'
  )} or ${codify('3xx')} or ${codify('failOnStatusCode')} is ${codify(
    'true'
  )}.`,
]

const createScrollabilityListItems = (cmd) => [
  createChildCommandDOMListItem(cmd),
  `${codify(cmd)} requires the element to be scrollable.`,
]

const createSelectabilityListItems = (cmd) => [
  createChildCommandDOMListItem(cmd),
  `${codify(cmd)} requires the element to be a ${codify('select')}.`,
]

const createShadowDOMListItems = (cmd) => [
  `${codify(
    cmd
  )} requires being chained off a command that yields a DOM element that is a shadow host (i.e. has a shadow root directly attached to it).`,
]

const createSpreadListItems = (cmd) => [
  createChildCommandListItem(cmd),
  `${codify(
    cmd
  )} requires being chained off a command that yields an array-like structure.`,
]

const createSubmitabilityListItems = (cmd) => [
  createChildCommandDOMListItem(cmd),
  `${codify(cmd)} requires the element to be a ${codify('form')}.`,
]

const createTaskListItems = (cmd) => [
  createParentListItems(cmd),
  `${codify(cmd)} requires the task to eventually end.`,
]

const createTickListItems = (cmd) => [
  createParentListItems(cmd),
  `${codify(cmd)} requires that ${codify('cy.clock()')} be called before it.`,
]

const createUncheckabilityListItems = (cmd) => [
  createChildCommandDOMListItem(cmd),
  `${cmd} requires the element to have type ${codify('checkbox')}.`,
]

const createWaitListItems = (cmd) => [
  `When passed a ${codify('time')} argument ${createDualCommandListItem(cmd)}.`,
  `When passed an ${codify('alias')} argument ${createParentCommandListItem(
    cmd
  )}.`,
]

const createWriteFileListItems = (cmd) => [
  createParentCommandListItem(cmd),
  `${codify(
    cmd
  )} requires the file be successfully written to disk. Anything preventing this such as OS permission issues will cause it to fail.`,
]

const CREATE_REQUIREMENTS_LIST_ITEMS_MAP = {
  blurability: createBlurabilityListItems,
  checkability: createCheckabilityListItems,
  child: createChildListItems,
  clearability: createClearabilityListItems,
  dom: createDOMListItems,
  dual: createDualListItems,
  dual_existence: createDualExistenceListItems,
  dual_existence_single_dom: createDualExistenceSingleDOMListItems,
  exec: createExecListItems,
  focusability: createFocusabilityListItems,
  none: createNoneListItems,
  parent: createParentListItems,
  page: createPageListItems,
  read_file: createReadFileListItems,
  request: createRequestListItems,
  scrollability: createScrollabilityListItems,
  selectability: createSelectabilityListItems,
  shadow_dom: createShadowDOMListItems,
  spread: createSpreadListItems,
  submitability: createSubmitabilityListItems,
  task: createTaskListItems,
  tick: createTickListItems,
  uncheckability: createUncheckabilityListItems,
  wait: createWaitListItems,
  write_file: createWriteFileListItems,
}

module.exports.createRequirementsListItems = (type, cmd) => {
  const buildRequirementListItems = CREATE_REQUIREMENTS_LIST_ITEMS_MAP[type]
  if (!buildRequirementListItems) {
    throw new Error(
      `{% requirements %} tag helper was provided an invalid option: ${type}`
    )
  }
  const executedCmd = `${cmd}()`
  return buildRequirementListItems(executedCmd)
}
