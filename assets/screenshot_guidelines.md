### The following is a list of direct links to sections that include a screenshot, animated gif, or video with associated code to recreate. Remember that the viewport will need to be zoomed, probably beyond what you'd expect, so that the areas of interest are visible when sized down to the main content well. In most cases below the viewport was at 150%. 

### The best workflow for high quailty/small output so far is to capture via quicktime -> trim accordingly -> convert file via https://gif.ski @960xXXX | speed at 1 notch | 20FPS | maxed out quality | loop forever (or comprable using the gifski CLI). 

# Cypress App v10 UI (no specific application)
  
http://localhost:3000/guides/getting-started/writing-your-first-end-to-end-test#Write-your-first-test
```js
describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  })
})

describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(false)
  })
})
```
  
http://localhost:3000/guides/getting-started/writing-your-first-end-to-end-test#Step-2-Query-for-an-element
```js
describe('My First Test', () => {
  it('finds the content "type"', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('hype')
  })
})
```
  
http://localhost:3000/guides/getting-started/testing-your-app#Step-2-Visit-your-server
1) touch cypress/e2e/home_page.cy.js -> capture full app UI with spec
```js
describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('http://localhost:8080')
  })
})
```
  
http://localhost:3000/guides/core-concepts/writing-and-organizing-tests#Support-file
```js
beforeEach(() => {
  cy.log('I run before every test in every spec file!!!!!!')
})

it('Testing spec 1', () => {
  cy.visit('https://example.cypress.io/')
})

it('Testing spec 2', () => {
  cy.visit('https://example.cypress.io/')
})
  ```
  
http://localhost:3000/guides/guides/launching-browsers#Browsers
1) Install many browsers on your machine so this looks interesting
2) Expand the dropdown over the spec list to include showing new UI

http://localhost:3000/guides/guides/cross-browser-testing
1) Load up spec in Firefox and show in dropdown menu as active browser

http://localhost:3000/guides/guides/launching-browsers#Customize-available-browsers
1) Install Brave browser and follow the steps on the page to customize Cypress config & use brave

```js
const { defineConfig } = require('cypress')

const execa = require('execa')
const findBrowser = () => {
  // the path is hard-coded for simplicity
  const browserPath =
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

  return execa(browserPath, ['--version']).then((result) => {
    // STDOUT will be like "Brave Browser 77.0.69.135"
    const [, version] = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(result.stdout)
    const majorVersion = parseInt(version.split('.')[0])

    return {
      name: 'Brave',
      channel: 'stable',
      family: 'chromium',
      displayName: 'Brave',
      version,
      path: browserPath,
      majorVersion,
    }
  })
}

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return findBrowser().then((browser) => {
        return {
          browsers: config.browsers.concat(browser),
        }
      })
    }
  }
})
```
# Cypress v10 Component Testing (no specific application)
http://localhost:3000/guides/core-concepts/retry-ability#Use-aliases
1) set up basic component & component test

```js
import { mount } from '@cypress/react'

const Clicker = ({ click }) => (
  <div>
    <button onClick={() => setTimeout(click, 500)}>Click me</button>
  </div>
)

it('calls the click prop', () => {
  const onClick = cy.stub().as('clicker')
  mount(<Clicker click={onClick} />)
  cy.get('button').click().click()

  // good practice 💡
  // auto-retry the stub until it was called twice
  cy.get('@clicker').should('have.been.calledTwice')
})
```

LoginForm.js
```js
import { useState } from 'react'

const LoginForm = ({ onLogin, title = 'Log In' }) => {
  const [submitted, setSubmitted] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const formSubmit = (event) => {
    event.preventDefault()
    if (username && password) {
      onLogin({ username, password })
    }
    setSubmitted(true)
  }

  return (
    <form className="login-form" onSubmit={formSubmit}>
      <fieldset>
        <legend>{title}</legend>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {submitted && !username && (
            <span className="error">Username is required</span>
          )}
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {submitted && !password && (
            <span className="error">Password is required</span>
          )}
        </label>
        <button type="submit">Login</button>
      </fieldset>
    </form>
  )
}

export default LoginForm
```

LoginForm.cy.js
```js
import { mount } from '@cypress/react'
import LoginForm from './LoginForm'

// http://localhost:3000/guides/getting-started/writing-your-first-component-test#The-hello-world-test
it('should work', () => {
  expect(false).to.equal(true)
})

// http://localhost:3000/guides/getting-started/writing-your-first-component-test#Updating-a-failing-test
it('should work', () => {
  expect(true).to.equal(true)
})

// http://localhost:3000/guides/getting-started/writing-your-first-component-test#Mounting-the-component
it('should mount the component', () => {
  mount(<LoginForm />)
})

// http://localhost:3000/guides/getting-started/writing-your-first-component-test#Top-level-grouping
describe('LoginForm', () => {
  it('should mount the component', () => {
    mount(<LoginForm />)
  })

  it('should have password input of type password', () => {
    mount(<LoginForm />)
    cy.contains('Password')
      .find('input')
      .should('have.attr', 'type', 'password')
  })

  it('should render title with default text', () => {
    mount(<LoginForm />)
    cy.get('legend').should('have.text', 'Log In')
  })

  it('should call onLogin with username and password on login', () => {
  const onLoginSpy = cy.spy()
  mount(<LoginForm onLogin={onLoginSpy} />)
})
  it('should render title with specified text', () => {
    const title = 'Please Authenticate'
    mount(<LoginForm title={title} />)
    cy.get('legend').should('have.text', title)
  })
})

// http://localhost:3000/guides/getting-started/writing-your-first-component-test#Testing-form-submit
it('should call onLogin with username and password on login', () => {
  const onLoginSpy = cy.spy()
  mount(<LoginForm onLogin={onLoginSpy} />)
})

it('should call onLogin with username and password on login', () => {
  const onLoginSpy = cy.spy()
  mount(<LoginForm onLogin={onLoginSpy} />)
  cy.contains('Username').find('input').type('testuser123')
  cy.contains('Password').find('input').type('s3cret')
  cy.get('button').contains('Login').click()
})

// http://localhost:3000/guides/getting-started/writing-your-first-component-test#Top-level-grouping
describe.only('LoginForm', () => {
  it.only('should mount the component', () => {
    mount(<LoginForm />)
  })

  it.only('should have password input of type password', () => {
    mount(<LoginForm />)
    cy.contains('Password')
      .find('input')
      .should('have.attr', 'type', 'password')
  })

  it.only('should render title with default text', () => {
    mount(<LoginForm />)
    cy.get('legend').should('have.text', 'Log In')
  })

  it.only('should render title with specified text', () => {
    const title = 'Please Authenticate'
    mount(<LoginForm title={title} />)
    cy.get('legend').should('have.text', title)
  })

// http://localhost:3000/guides/getting-started/writing-your-first-component-test#Writing-better-tests-with-beforeEach
  describe('form tests', () => {
    const username = 'testuser123'
    const password = 's3cret'
  
    beforeEach(() => {
      const onLoginSpy = cy.spy().as('onLoginSpy')
      mount(<LoginForm onLogin={onLoginSpy} />)
      cy.contains('Username').find('input').as('usernameInput')
      cy.contains('Password').find('input').as('passwordInput')
      cy.get('button').contains('Login').as('loginButton')
    })
  
    it('should call onLogin with username and password when the Login button is clicked', () => {
      cy.get('@usernameInput').type(username)
      cy.get('@passwordInput').type(password)
      cy.get('@loginButton').click()
      cy.get('@onLoginSpy').should('have.been.calledWith', {
        username,
        password,
      })
    })
  
    it('should call onLogin with username and password when enter is pressed in an input', () => {
      cy.get('@usernameInput').type(username)
      cy.get('@passwordInput').type(password).type('{enter}')
      cy.get('@onLoginSpy').should('have.been.calledWith', {
        username,
        password,
      })
    })

    it('should show both validation errors if login is attempted without entering username or password', () => {
      cy.get('@loginButton').click()
      cy.contains('Username is required')
      cy.contains('Password is required')
      cy.get('@onLoginSpy').should('not.have.been.called')
    })

    it('should only show password validation error if login is attempted without entering password', () => {
      cy.get('@usernameInput').type(username)
      cy.get('@loginButton').click()
      cy.contains('Username is required').should('not.exist')
      cy.contains('Password is required')
      cy.get('@onLoginSpy').should('not.have.been.called')
    })
    
    it('should only show username validation error if login is attempted without entering username', () => {
      cy.get('@passwordInput').type(password)
      cy.get('@loginButton').click()
      cy.contains('Username is required')
      cy.contains('Password is required').should('not.exist')
      cy.get('@onLoginSpy').should('not.have.been.called')
    })

    it('should not show any validation errors before login is attempted', () => {
      cy.contains('Username is required').should('not.exist')
      cy.contains('Password is required').should('not.exist')
    })

  })
})
```

http://localhost:3000/guides/core-concepts/cypress-app#Component-Under-Test
```js
it('should have password input of type password', () => {
  mount(<LoginForm />)
  cy.contains('Password').find('input').should('have.attr', 'type', 'password')
})
```

# [Cypress Real World App App](https://github.com/cypress-io/cypress-realworld-app)

http://localhost:3000/guides/overview/why-cypress#Cypress-in-the-Real-World
1) Load [transaction-feeds.spec](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/tests/ui/transaction-feeds.spec.ts) in a text editor & open Cyress >= v10
2) Capture both editor and Cypress UI side-by side, overlapping

http://localhost:3000/guides/guides/test-retries#How-It-Works
1) Run below test with the retries included

```js
it("should display login errors", { retries: { openMode: 2 } }, function () {
  cy.visit("/");

  cy.getBySel("signin-username").type("User").find("input").clear().blur();
  cy.get("#username-helper-textc").should("be.visible").and("contain", "Username is required");
  cy.visualSnapshot("Display Username is Required Error");

  cy.getBySel("signin-password").type("abc").find("input").blur();
  cy.get("#password-helper-text")
    .should("be.visible")
    .and("contain", "Password must contain at least 4 characters");
  cy.visualSnapshot("Display Password Error");

  cy.getBySel("signin-submit").should("be.disabled");
  cy.visualSnapshot("Sign In Submit Disabled");
});
```

# [Cypress Example ToDo MVC](https://github.com/cypress-io/cypress-example-todomvc)

http://localhost:3000/guides/core-concepts/writing-and-organizing-tests#Passed
```js
describe('TodoMVC', () => {
  it('adds 2 todos', function () {
    cy.visit('/')

    cy.get('.new-todo')
    .type('learn testing{enter}')
    .type('be cool{enter}')

    // passing
    // cy.get('.todo-list li').should('have.length', 2)

    // failing
    cy.get('.todo-list li').should('have.length', 100)
  })
})
```

http://localhost:3000/guides/core-concepts/writing-and-organizing-tests#Pending
```js
describe('TodoMVC', () => {
  it('is not written yet')

  it('adds 2 todos', function () {
    cy.visit('/')
    cy.get('.new-todo').type('learn testing{enter}').type('be cool{enter}')
    cy.get('.todo-list li').should('have.length', 100)
  })

  xit('another test', () => {
    expect(false).to.true
  })
}  
```

http://localhost:3000/guides/core-concepts/writing-and-organizing-tests#Skipped
```js
describe('TodoMVC', () => {
  // passing
  beforeEach(() => {
    cy.visit('/')
  })

  // failing
  beforeEach(() => {
    cy.visit('/does-not-exist')
  })

  it('hides footer initially', () => {
    cy.get('.filters').should('not.exist')
  })

  it('adds 2 todos', () => {
    cy.get('.new-todo').type('learn testing{enter}').type('be cool{enter}')
    cy.get('.todo-list li').should('have.length', 2)
  })
}
```

http://localhost:3000/guides/core-concepts/retry-ability#Commands-vs-assertions
```js
it('creates 2 items', () => {
  cy.visit('/') // command
  cy.focused() // command
    .should('have.class', 'new-todo') // assertion

  cy.get('.new-todo') // command
    .type('todo A{enter}') // command
    .type('todo B{enter}') // command

  cy.get('.todo-list li') // command
    .should('have.length', 2) // assertion
})
```

http://localhost:3000/guides/core-concepts/retry-ability#Only-the-last-command-is-retried

1) Add below method to [todoModel.js](https://github.com/cypress-io/cypress-example-todomvc/blob/master/js/todoModel.js)
2) Adjust ms delay for both references on the page

```js
app.TodoModel.prototype.addTodo = function (title) {
  this.todos = this.todos.concat({
    id: Utils.uuid(),
    title: title,
    completed: false,
  })

  // let's trigger the UI to render after 3 seconds
  setTimeout(() => {
    this.inform()
  }, 3000)
}
```

http://localhost:3000/guides/core-concepts/retry-ability#Multiple-assertions (gif)
```js
cy.get('.todo-list li') // command
  .should('have.length', 2) // assertion
  .and(($li) => {
    // 2 more assertions
    expect($li.get(0).textContent, 'first item').to.equal('todo a')
    expect($li.get(1).textContent, 'second item').to.equal('todo B')
  })
```

http://localhost:3000/guides/core-concepts/retry-ability#Built-in-assertions (gif)
```js
cy.get('.todo-list li') // command
  .should('have.length', 2) // assertion
  .eq(3) // co
```

http://localhost:3000/guides/core-concepts/retry-ability#Only-the-last-command-is-retried (gif)
```js
it('adds two items', () => {
  cy.visit('/')

  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li').find('label').should('contain', 'todo A')

  cy.get('.new-todo').type('todo B{enter}')
  cy.get('.todo-list li').find('label').should('contain', 'todo B')
})
```

http://localhost:3000/guides/core-concepts/retry-ability#Merging-queries (gif)
```js
it('adds two items', () => {
  cy.visit('/')

  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li label') // 1 query command
    .should('contain', 'todo A') // assertion

  cy.get('.new-todo').type('todo B{enter}')
  cy.get('.todo-list li label') // 1 query command
    .should('contain', 'todo B') // assertion
})
```

http://localhost:3000/guides/core-concepts/retry-ability#Alternate-commands-and-assertions
```js
it('adds two items', () => {
  cy.visit('/')

  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li') // command
  .should('have.length', 1) // assertion
  .find('label') // command
  .should('contain', 'todo A') // assertion

  cy.get('.new-todo').type('todo B{enter}')
  cy.get('.todo-list li') // command
  .should('have.length', 2) // assertion
  .find('label') // command
  .should('contain', 'todo B') // assertion
})
```

http://localhost:3000/guides/core-concepts/retry-ability#Use-should-with-a-callback
1) add below to index.html file in root
```html
<div class="random-number-example">
  Random number: <span id="random-number">🎁</span>
</div>
<script>
  const el = document.getElementById('random-number')
  setTimeout(() => {
    el.innerText = Math.floor(Math.random() * 10 + 1)
  }, 1500)
</script>
```

```js
describe('Assertions', () => {
  describe('Explicit Assertions', () => {
    it('retries the .should() callback until assertions pass', () => {
      cy.visit('/')
      // WRONG: this test will not work as intended
      cy.get('#random-number') // <div>🎁</div>
      .invoke('text') // "🎁"
      .then(parseFloat) // NaN
      .should('be.gte', 1) // fails
      .and('be.lte', 10) // never evaluates
    })
  })
})
```

http://localhost:3000/guides/core-concepts/retry-ability#Correctly-waiting-for-values (gif)
1) Run the last test in [this spec](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/cypress/integration/2-advanced-examples/assertions.spec.js)
2) Hide the surrounding html to isolate the random counter & bump up font-size in-line to make visible in example
```js
cy.get('#random-number').should(($div) => {
  // all the code inside here will retry
  // until it passes or times out
  const n = parseFloat($div.text())

  expect(n).to.be.gte(1).and.be.lte(10)
})
```

http://localhost:3000/guides/core-concepts/retry-ability#Correctly-waiting-for-the-stub-to-be-called (gif)
```js
it('calls the click prop', () => {
  const onClick = cy.stub().as('clicker')
  cy.mount(<Clicker click={onClick} />)
  cy.get('button').click().click()

  // good practice 💡
  // auto-retry the stub until it was called twice
  cy.get('@clicker').should('have.been.calledTwice')
})
```

http://localhost:3000/guides/core-concepts/interacting-with-elements#Coordinates
```js
describe('TodoMVC - React', function () {
    // setup these constants to match what TodoMVC does
    let TODO_ITEM_ONE = 'buy some cheese'
    let TODO_ITEM_TWO = 'feed the cat'
    let TODO_ITEM_THREE = 'book a doctors appointment'

    beforeEach(function () {
      // Go out and visit our local web server
      // before each test, which serves us the
      // TodoMVC App we want to test against
    
      // We've set our baseUrl to be http://localhost:8888
      cy.visit('/')
    })

  context('Routing', function () {
    // New commands used here:
    // https://on.cypress.io/window
    // https://on.cypress.io/its
    // https://on.cypress.io/invoke
    // https://on.cypress.io/within

    beforeEach(function () {
      cy.createDefaultTodos().as('todos')
    })

    it('should allow me to display active items', function () {
      cy.get('@todos')
      .eq(1)
      .find('.toggle')
      .check()

      cy.get('.filters')
      .contains('Active')
      .click()

      cy.get('@todos')
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      cy.get('@todos')
      .eq(1)
      .should('contain', TODO_ITEM_THREE)
    })
  })
})
```

http://localhost:3000/guides/core-concepts/cypress-app#What-you-ll-learn
1) Hero image of Cypress GUI
Load [this test](https://github.com/cypress-io/cypress-example-todomvc/blob/724757df744c499a3596ca45c2c57da3aad371a5/cypress/integration/app_spec.js#L89) 

http://localhost:3000/guides/core-concepts/cypress-app#Finding-Selectors (gif)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            margin: 0px;
            padding: 0px;
            box-sizing: border-box;
         }
        .wrapper {
            height: 100vh;
            display: grid;
            place-content: center;
            grid-template-columns: 100px 100px;
            grid-gap: 1rem;
        }
        .wrapper > * {
            outline: 1px solid grey;
            font-size: 14px;
            font-family: system-ui;
            padding: 5px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div data-cy="cy-id">data-cy</div>
        <div data-test="test-id">data-test</div>
        <div data-testid="testid-id">data-testid</div>
        <div id="some-id">ID</div>
        <div class="someClass">Class</div>
        <main>Tag</main>
    </div>
</body>
</html>
```
```js
it('shows off selector playground', () => {
    cy.visit('../../selector-playground.html')
    cy.viewport(300, 200)
})
```

http://localhost:3000/guides/core-concepts/cypress-app#Errors
1) add button to todomvc app index.html or any app where appropriate: 
```html
<button class="submit-button" style="display:none">Submit</button>
```
```js
describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('http://localhost:5000')
    cy.get('.submit-button').click() //added in .html for screenshot
  })
})  
```

# [Cypress Example Kitchen Sink](https://github.com/cypress-io/cypress-example-kitchensink)

http://localhost:3000/guides/core-concepts/variables-and-aliases#Elements
```js
context('Aliasing', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/commands/aliasing')
  })

  it('.as() - alias a route for later use', () => {
    // Alias the route to wait for its response
    cy.intercept('GET', '**/comments/*').as('getComment')

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    cy.get('.network-btn').click()

    // https://on.cypress.io/wait
    cy.wait('@getComment').its('response.statusCode').should('eq', 200)
  })
})
```

http://localhost:3000/guides/core-concepts/cypress-app#Command-Log
```js  
context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/commands/actions')
  })

  it('.type() - type into a DOM element', () => {
    // https://on.cypress.io/type
    cy.get('.action-email')
      .type('fake@email.com').should('have.value', 'fake@email.com')

      // .type() with special character sequences
      .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
      .type('{del}{selectall}{backspace}')

      // .type() with key modifiers
      .type('{alt}{option}') //these are equivalent
      .type('{ctrl}{control}') //these are equivalent
      .type('{meta}{command}{cmd}') //these are equivalent
      .type('{shift}')

      // Delay each keypress by 0.1 sec
      .type('slow.typing@email.com', { delay: 100 })
      .should('have.value', 'slow.typing@email.com')

    cy.get('.action-disabled')
      // Ignore error checking prior to type
      // like whether the input is visible or disabled
      .type('disabled error checking', { force: true })
      .should('have.value', 'disabled error checking')
  })

  it('.focus() - focus on a DOM element', () => {
    // https://on.cypress.io/focus
    cy.get('.action-focus').focus()
      .should('have.class', 'focus')
      .prev().should('have.attr', 'style', 'color: orange;')
  })

  it('.blur() - blur off a DOM element', () => {
    // https://on.cypress.io/blur
    cy.get('.action-blur').type('About to blur').blur()
      .should('have.class', 'error')
      .prev().should('have.attr', 'style', 'color: red;')
  })

  it('.clear() - clears an input or textarea element', () => {
    // https://on.cypress.io/clear
    cy.get('.action-clear').type('Clear this text')
      .should('have.value', 'Clear this text')
      .clear()
      .should('have.value', '')
  })

  it('.submit() - submit a form', () => {
    // https://on.cypress.io/submit
    cy.get('.action-form')
      .find('[type="text"]').type('HALFOFF')

    cy.get('.action-form').submit()
      .next().should('contain', 'Your form has been submitted!')
  })
})  
```

http://localhost:3000/guides/core-concepts/cypress-app#Open-files-in-your-IDE (gif)
1) Position text editor over test runner window & return to runner so that things overlap when opening. Include doc (Mac) to show the icon bounce. 

http://localhost:3000/guides/core-concepts/cypress-app#Time-Traveling
```js
describe('My First Test', () => {
  it('Gets, types and asserts', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify that the value has been updated
    cy.get('.action-email')
        .type('fake@email.com')
        .should('have.value', 'fake@email.com')
  })
})
```

http://localhost:3000/guides/core-concepts/cypress-app#Instrument-Panel
```js
context('Spies, Stubs, and Clock', () => {
  it('spy command log', () => {
    cy.visit('http://localhost:8080/commands/spies-stubs-clocks')

    const obj = {
      foo () {},
    }

    const spy = cy.spy(obj, 'foo').as('anyArgs')

    obj.foo()

    expect(spy).to.be.called
  })

  it('stub command log', () => {
    cy.visit('http://localhost:8080/commands/spies-stubs-clocks')

    const obj = {
      /**
        * prints both arguments to the console
        * @param a {string}
        * @param b {string}
      */
      foo (a, b) {
        // eslint-disable-next-line no-console
        console.log('a', a, 'b', b)
      },
    }

    const stub = cy.stub(obj, 'foo').as('foo')

    obj.foo('foo', 'bar')

    expect(stub).to.be.called
  })
}  
```

http://localhost:3000/guides/core-concepts/cypress-app#Application-Under-Test
```js
it('should assert that <title> is correct', () => {
  cy.visit('https://example.cypress.io')
  // cy.wait(50000)
  cy.title().should('include', 'Kitchen Sink')
}) 
```

http://localhost:3000/guides/core-concepts/cypress-app#Console-output
```js
describe('My First Test', () => {
  it('Gets, types and asserts', () => {
    // cy.viewport(1000,450)
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify that the value has been updated
    cy.get('.action-email')
        .type('fake@email.com')
        .should('have.value', 'fake@email.com')
  })
})
```

http://localhost:3000/guides/core-concepts/cypress-app#Special-commands
```js
describe('My First Test', () => {
  it('clicking "type" shows the right headings', () => {
    cy.visit('https://example.cypress.io')

    cy.pause()

    cy.contains('type').click()

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify that the value has been updated
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
```

http://localhost:3000/guides/guides/network-requests#Routing
```js
it('should list users', () => {
  cy.intercept({
    method: 'GET',
    // Route all GET requests
    url: '/users/*' // that have a URL that matches '/users/*'

  }, [] // and force the response to be: []
  ).as('getUsers'); // and assign an alias
})
```

http://localhost:3000/guides/guides/network-requests#Failures
```js
it('show wiat error', () => {
  cy.intercept('/search*', [{ item: 'Book 1' }, { item: 'Book 2' }]).as(
    'getSearch',
  )

  // our autocomplete field is throttled
  // meaning it only makes a request after
  // 500ms from the last keyPress
  // cy.get('#autocomplete').type('Book')

  // wait for the request + response
  // thus insulating us from the
  // throttled request
  cy.wait('@getSearch')

  cy.get('#results')
      .should('contain', 'Book 1').and('contain', 'Book 2')
})
```
