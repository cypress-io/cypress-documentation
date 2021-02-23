const { codify } = require("./customTagUtils");

module.exports.createUsageOptions = (option, type) => {
  const blurbs = {
    animationDistanceThreshold: () => {
      const url = `{% url 'considered animating' interacting-with-elements#Animations %}`;
      return `The distance in pixels an element must exceed over time to be ${url}.`;
    },

    log: () => {
      /* eslint-disable quotes */
      const url = `{% url 'Command log' test-runner#Command-Log %}`;
      return `Displays the command in the ${url}`;
    },

    force: () => {
      /* eslint-disable quotes */
      const url = `{% urlHash 'waiting for actionability' Assertions %}`;
      return `Forces the action, disables ${url}`;
    },

    timeout: () => {
      /* eslint-disable quotes */
      const url = `{% urlHash 'timing out' Timeouts %}`;
      return `Time to wait for ${codify(`${type}()`)} to resolve before ${url}`;
    },

    multiple: () => {
      return "Serially click multiple elements";
    },

    retryOnStatusCodeFailure: () => {
      return "Whether Cypress should automatically retry status code errors under the hood. Cypress will retry a request up to 4 times if this is set to true.";
    },

    retryOnNetworkFailure: () => {
      return "Whether Cypress should automatically retry transient network errors under the hood. Cypress will retry a request up to 4 times if this is set to true.";
    },

    withinSubject: () => {
      return "Element to search for children in. If null, search begins from root-level DOM element";
    },

    ctrlKey: () => {
      return "Activates the control key. Aliases: <code>controlKey</code>.";
    },

    altKey: () => {
      return "Activates the alt key (option key for Mac). Aliases: <code>optionKey</code>.";
    },

    shiftKey: () => {
      return "Activates the shift key.";
    },

    metaKey: () => {
      return "Activates the meta key (Windows key or command key for Mac). Aliases: <code>commandKey</code>, <code>cmdKey</code>.";
    },

    includeShadowDom: () => {
      return "Whether to traverse shadow DOM boundaries and include elements within the shadow DOM in the yielded results.";
    },

    waitForAnimations: () => {
      const url = `{% url 'finish animating' interacting-with-elements#Animations %}`;

      return `Whether to wait for elements to ${url} before executing the command.`;
    },

    scrollBehavior: () => {
      const url = `{% url 'should be scrolled' interacting-with-elements#Scrolling %}`;

      return `Viewport position to where an element ${url} before executing the command`;
    },
  };

  const blurb = blurbs[option];

  if (!blurb) {
    throw new Error(
      `{% usage_options %} tag helper was provided an invalid option: ${option}`
    );
  }

  return blurb();
};
