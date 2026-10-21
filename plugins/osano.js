// Osano renders its dialog outside our HTML, so FullStory labels can't go in a
// template. This tags the dialog's buttons once Osano shows it. Clicks on the
// close button land on its inner <svg>, which FullStory reports by the SVG's
// <title> ("Close this dialog"), so every descendant gets the label too.
const fullStoryLabels = `
(function () {
  var LABELS = {
    '.osano-cm-button--type_accept': 'Cookie Consent - Accept',
    '.osano-cm-button--type_denyAll': 'Cookie Consent - Reject',
    '.osano-cm-button--type_deny': 'Cookie Consent - Reject',
    '.osano-cm-button--type_manage': 'Cookie Consent - Manage Preferences',
    '.osano-cm-close': 'Cookie Consent - Dismiss'
  };
  function label(root) {
    if (!root) return;
    Object.keys(LABELS).forEach(function (selector) {
      root.querySelectorAll(selector).forEach(function (button) {
        [button].concat(Array.from(button.querySelectorAll('*'))).forEach(function (el) {
          el.setAttribute('data-fs-element', LABELS[selector]);
        });
      });
    });
  }
  function subscribe() {
    var cm = window.Osano && window.Osano.cm;
    if (!cm || !cm.addEventListener) return;
    cm.addEventListener('osano-cm-ui-changed', function (component, stateChange) {
      if (component === 'dialog' && stateChange === 'show') {
        label(document.querySelector('.osano-cm-dialog'));
      }
    });
    // The dialog can mount before this listener attaches, so its 'show' event is already gone.
    label(document.querySelector('.osano-cm-dialog'));
  }
  // osano.js loads synchronously just before this, so Osano.cm exists unless the script was blocked.
  subscribe();
})();
`

module.exports = async function osano(context) {
  return {
    name: 'docusaurus-osano-plugin',
    injectHtmlTags({ content }) {
      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              src: 'https://cmp.osano.com/AzqisZTSBrMdc3qLt/bb12d637-24a5-47ce-8788-92e13ca795cf/osano.js',
            }
          },
          {
            tagName: 'script',
            innerHTML: fullStoryLabels,
          },
        ],
      }
    },
  };
};
