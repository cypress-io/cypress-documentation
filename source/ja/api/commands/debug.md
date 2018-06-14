---
title: debug

---

Set a `debugger` and log what the previous command yields.

{% note warning %}
You need to have your Developer Tools open for `.debug()` to hit the breakpoint.
{% endnote %}

# シンタックス

```javascript
.debug()
.debug(options)

// ---or---

cy.debug()
cy.debug(options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.debug().getCookie('app') // Pause to debug at beginning of commands
cy.get('nav').debug()       // Debug the `get` command's yield
```

## 引数

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.debug()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}

## 実行結果 {% helper_icon yields %}

{% yields same_subject .debug %}

# 例

## Debug

***Pause with debugger after `.get()`***

```javascript
cy.get('a').debug().should('have.attr', 'href')
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements dual .debug %}

## アサーション {% helper_icon assertions %}

{% assertions utility .debug %}

## タイムアウト {% helper_icon timeout %}

{% timeouts none .debug %}

# コマンドログ

***Log out the current subject for debugging***

```javascript
cy.get(".ls-btn").click({ force: true }).debug()
```

The commands above will display in the command log as:

![Command Log debug](/img/api/debug/how-debug-displays-in-command-log.png)

When clicking on the `debug` command within the command log, the console outputs the following:

![console.log debug](/img/api/debug/console-gives-all-debug-info-for-command.png)

# こちらも参考にしてください

- {% url 'Dashboard' https://on.cypress.io/dashboard %}
- {% url `.pause()` pause %}
- {% url `cy.log()` log %}
- {% url `.screenshot()` screenshot %}
