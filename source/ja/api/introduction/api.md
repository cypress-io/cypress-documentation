---
title: API

---

# Sections

- **{% url 'Commands:' and %}** Drive your tests in the browser like a real user would. They let you perform actions like typing, clicking, xhr requests, and can also assert things like "my button should be disabled".

- **{% url 'Events:' catalog-of-events %}** See a list of Cypress events that are fired and the accompanying methods used to listen to and remove those events.

- **{% url 'Utilities:' _ %}** Access methods from other commonly used libraries.

- **{% url 'Cypress API:' custom-commands %}** Configure the behavior of how Cypress works internally. You can do things like access Environment Variables, change configuration, create custom commands, and more.

- **{% url 'Plugins:' writing-a-plugin %}** Write a plugin to modify and extend the behavior of Cypress.

# Rules

Each document attempts to cover the essentials of each method including:

**Syntax:** The method signature and any accepted arguments.

  - **Usage:** How to call the method including valid and invalid uses.

  - **Arguments:** Definition of arguments including types accepted.

  - **Yields:** What is yielded (and in rare cases, returned) from the method.


**Examples:** Real world examples of using the methods.

**Notes:** Any exceptions to take into account when using the method.

**Rules:** Built in behavior of Cypress surrounding the command.

  - **Requirements:** What built in requirements the command has.

  - **Assertions:** How assertions are handled, and whether default ones are applied.

  - **Timeout:** If defined, the amount of time the method allows to execute before throwing.

**Command Log:** If and how the method displays in the Cypress Command Log and console.

**See also:** Other related methods.

## Intelligent Code Completion

IntelliSense is available for Cypress. It offers intelligent parameter information when writing Cypress commands directly in your IDE. {% url "Learn how to set up Intelligent Code Completion." intelligent-code-completion %}

# Reporting a Problem

If you spot a typo, broken link, incorrect code sample or want to contribute to improve the documentation, we're happy to have your help!

**To report a problem:**

- Use the 'Improve this doc' link at the top of the document.

- Open an issue or pull request to the [GitHub repository](https://github.com/cypress-io/cypress).
