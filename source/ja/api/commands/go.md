---
title: go

---

Navigate back or forward to the previous or next URL in the browser's history.


# シンタックス

```javascript
cy.go(direction)
cy.go(direction, options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.go('back')    
```

## 引数

**{% fa fa-angle-right %} direction** ***(String, Number)***

The direction to navigate.

You can use `back` or `forward` to go one step back or forward. You could also navigate to a specific history position (`-1` goes back one page, `1` goes forward one page, etc).

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.go()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `pageLoadTimeout` configuration#Timeouts %} | {% usage_options timeout cy.go %}

## 実行結果 {% helper_icon yields %}

{% yields sets_subject cy.go 'yields the `window` object after the page finishes loading' %}

# 例

## Direction

***Go back in browser's history***

```javascript
cy.go('back')   // equivalent to clicking back button
```

***Go forward in browser's history***

```javascript
cy.go('forward') // equivalent to clicking forward button
```

## Number

***Go back in browser's history***

```javascript
cy.go(-1)       // equivalent to clicking back button
```

***Go forward in browser's history***

```javascript
cy.go(1)        // equivalent to clicking forward button
```

# ノート

***Refreshing and loading the page***

If going forward or back causes a full page refresh, Cypress will wait for the new page to load before moving on to new commands.

Cypress additionally handles situations where a page load was not caused (such as hash routing) and will resolve immediately.

# ルール

## 条件 {% helper_icon requirements %}

{% requirements page cy.go %}

## アサーション {% helper_icon assertions %}

{% assertions wait cy.go %}

## タイムアウト {% helper_icon timeout %}

{% timeouts page cy.go %}

# コマンドログ

***Go back in browser's history***

```javascript
cy
  .visit('http://localhost:8000/folders')
  .go('back')
```

The commands above will display in the command log as:

![Command Log](/img/api/go/test-showing-go-back-browser-button.png)

When clicking on the `go` command within the command log, the console outputs the following:

![Console Log](/img/api/go/window-is-logged-when-go-back-in-browser-history.png)

# こちらも参考にしてください

- {% url `cy.reload()` reload %}
- {% url `cy.visit()` visit %}
