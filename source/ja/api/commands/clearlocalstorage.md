---
title: clearLocalStorage

---

Clear data in local storage.

{% note warning %}
Cypress automatically runs this command *before* each test to prevent state from being shared across tests. You shouldn't need to use this command unless you're using it to clear localStorage inside a single test.
{% endnote %}

# シンタックス

```javascript
cy.clearLocalStorage()
cy.clearLocalStorage(key)
cy.clearLocalStorage(options)
cy.clearLocalStorage(keys, options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.clearLocalStorage()  // clear all local storage
```

## 引数

**{% fa fa-angle-right %} keys** ***(String, RegExp)***

Specify key to be cleared in local storage.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.clearLocalStorage()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}

## 実行結果 {% helper_icon yields %}

{% yields null cy.clearLocalStorage %}

# 例

## 引数なしの場合

**Clear all local storage**

```javascript
cy.clearLocalStorage()
```

## Specific Key

***Clear local storage with key 'appName'***

```javascript
cy.clearLocalStorage('appName')
```

***Clear all local storage matching /app-/***

```javascript
cy.clearLocalStorage(/app-/)
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements parent cy.clearLocalStorage %}

## アサーション {% helper_icon assertions %}

{% assertions none cy.clearLocalStorage %}

## タイムアウト {% helper_icon timeout %}

{% timeouts none cy.clearLocalStorage %}

# コマンドログ

```javascript
cy.clearLocalStorage(/prop1|2/).then((ls) => {
  expect(ls.getItem('prop1')).to.be.null
  expect(ls.getItem('prop2')).to.be.null
  expect(ls.getItem('prop3')).to.eq('magenta')
})
```

The commands above will display in the command log as:

![Command log for clearLocalStorage](/img/api/clearlocalstorage/clear-ls-localstorage-in-command-log.png)

When clicking on `clearLocalStorage` within the command log, the console outputs the following:

![console.log for clearLocalStorage](/img/api/clearlocalstorage/local-storage-object-shown-in-console.png)

# こちらも参考にしてください

- {% url `cy.clearCookies()` clearcookies %}
