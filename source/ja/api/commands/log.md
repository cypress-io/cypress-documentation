---
title: log
---

Print a message to the Cypress Command Log.

# シンタックス

```javascript
cy.log(message)
cy.log(message, args...)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.log('created new user')
```

## 引数

**{% fa fa-angle-right %} message** ***(String)***

Message to be printed to Cypress Command Log.

**{% fa fa-angle-right %} args...**

Additional arguments to be printed to the Cypress Command Log. There is no limit to the number of arguments.

## 実行結果 {% helper_icon yields %}

{% yields null cy.log %}

# 例

## Message

### Print a message to the Command Log.

```javascript
cy.click('Login')
cy.url().should('not.include', 'login')
cy.log('Login successful')
```

## Args

### Print a message with arguments to the Command Log.

```javascript
cy.log('events triggered', events)
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements parent cy.log %}

## アサーション {% helper_icon assertions %}

{% assertions none cy.log %}

## タイムアウト {% helper_icon timeout %}

{% timeouts none cy.log %}

# コマンドログ

### Print messages with arguments to the Command Log.

```javascript
cy.log('log out any message we want here')
cy.log('another message', ['one', 'two', 'three'])
```

The commands above will display in the command log as:

![Command Log log](/img/api/log/custom-command-log-with-any-message.png)

When clicking on `log` within the command log, the console outputs the following:

![Console log log](/img/api/log/console-shows-logs-message-and-any-arguments.png)

# こちらも参考にしてください

- {% url `cy.exec()` exec %}
- {% url `Cypress.log` cypress-log %}
- {% url `cy.task()` task %}
