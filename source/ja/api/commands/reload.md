---
title: reload

---

Reload the page.

# シンタックス

```javascript
cy.reload()
cy.reload(forceReload)
cy.reload(options)
cy.reload(forceReload, options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.reload()    
```

## 引数

**{% fa fa-angle-right %} forceReload** ***(Boolean)***

Whether to reload the current page without using the cache. `true` forces the reload without cache.

**{% fa fa-angle-right %} options** ***(Object)***

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `pageLoadTimeout` configuration#Timeouts %} | {% usage_options timeout cy.reload %}

## 実行結果 {% helper_icon yields %}

{% yields sets_subject cy.reload 'yields the `window` object after the page finishes loading' %}

# 例

## 引数なしの場合

***Reload the page as if the user clicked 'Refresh'***

```javascript
cy.visit('http://localhost:3000/admin')
cy.get('#undo-btn').click().should('not.be.visible')
cy.reload()
cy.get('#undo-btn').click().should('not.be.visible')
```

## Force Reload

***Reload the page without using the cache***

```javascript
cy.visit('http://localhost:3000/admin')
cy.reload(true)
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements page cy.reload %}

## アサーション {% helper_icon assertions %}

{% assertions wait cy.reload %}

## タイムアウト {% helper_icon timeout %}

{% timeouts page cy.reload %}

# コマンドログ

***Reload the page***

```javascript
cy.reload()
```

The commands above will display in the command log as:

![Command Log](/img/api/reload/test-page-after-reload-button.png)

When clicking on `reload` within the command log, the console outputs the following:

![Console Log](/img/api/reload/command-log-for-reload-cypress.png)

# こちらも参考にしてください

- {% url `cy.go()` go %}
- {% url `cy.visit()` visit %}
