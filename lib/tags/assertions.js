const rawRender = require('../raw_render')

module.exports = function yields (hexo, args) {
  // {% requirements parent cy.clearCookies %}
  // {% requirements blurability .blur %}
  // {% requirements focusability .blur %}
  // {% requirements checkability .click %}
  // {% requirements dom .click %}
  // {% requirements dom .children %}

  const type = args[0]
  const cmd = `<code>${args[1]}()</code>`

  const waitAssertions = `${cmd} will automatically wait for assertions you've chained to pass`

  const retryAssertions = `${cmd} will automatically {% url "retry" retry-ability %} until assertions you've chained all pass`

  const exist = `${cmd} will automatically {% url "retry" retry-ability %} until the element(s) {% url 'exist in the DOM' introduction-to-cypress#Default-Assertions %}`

  const actionable = `${cmd} will automatically wait for the element to reach an {% url 'actionable state' interacting-with-elements %}`

  const render = (str) => {
    return rawRender.call(this, hexo, str)
  }

  const none = () => {
    return `<ul>
      <li><p>${cmd} cannot have any assertions chained.</p></li>
    </ul>`
  }

  const wait = () => {
    return `<ul>
      <li><p>${waitAssertions}.</p></li>
    </ul>`
  }

  const retry = () => {
    return render(`<ul>
      <li><p>${retryAssertions}.</p></li>
    </ul>`)
  }

  const invoke = () => {
    return render(`<ul>
      <li><p>${cmd} will wait for the <code>function</code> to exist on the subject before running.</p></li>
      <li><p>${cmd} will wait for the promise to resolve if the invoked <code>function</code> returns a promise.</p></li>
      <li><p>${retryAssertions}.</p></li>
    </ul>`)
  }

  const once = () => {
    return render(`<ul>
      <li><p>${cmd} will only run assertions you've chained once, and will not {% url "retry" retry-ability %}.</p></li>
    </ul>`)
  }

  const utility = () => {
    return `<ul>
      <li><p>${cmd} is a utility command.</p></li>
      <li><p>${cmd} will not run assertions. Assertions will pass through as if this command did not exist.</p></li>
    </ul>`
  }

  const its = () => {
    return render(`<ul>
      <li><p>${cmd} will automatically {% url "retry" retry-ability %} until the subject's property is not <code>null</code> or <code>undefined</code>.</p></li>
      <li><p>${retryAssertions}.</p></li>
    </ul>`)
  }

  const existence = () => {
    return render(`<ul>
      <li><p>${exist}.</p></li>
      <li><p>${retryAssertions}.</p></li>
    </ul>`)
  }

  const shadowDomExistence = () => {
    return render(`<ul>
      <li><p>${exist}.</p></li>
      <li><p>${cmd} will automatically {% url "retry" retry-ability %} until the element(s) host(s) a shadow root.</p></li>
      <li><p>${retryAssertions}.</p></li>
    </ul>`)
  }

  const actions = () => {
    return render(`<ul>
      <li><p>${actionable}.</p></li>
      <li><p>${waitAssertions}.</p></li>
    </ul>`)
  }

  const wrap = () => {
    return render(`<ul>
      <li><p>${cmd}, when its argument is a promise, will automatically wait until the promise resolves. If the promise is rejected, ${cmd} will fail the test.</li>
      <li><p>${retryAssertions}.</p></li>
    </ul>`)
  }

  switch (type) {
    case 'none':
      return none()
    case 'once':
      return once()
    case 'wait':
      return wait()
    case 'retry':
      return retry()
    case 'utility':
      return utility()
    case 'its':
      return its()
    case 'invoke':
      return invoke()
    case 'existence':
      return existence()
    case 'shadow_dom_existence':
      return shadowDomExistence()
    case 'actions':
      return actions()
    case 'wrap':
      return wrap()
    default:
      // error when an invalid usage option was provided
      throw new Error(`{% assertions %} tag helper was provided an invalid option: ${type}`)
  }
}
