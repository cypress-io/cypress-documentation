---
title: getCookie

---

Get a browser cookie by its name.

# シンタックス

```javascript
cy.getCookie(name)
cy.getCookie(name, options)
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.getCookie('auth_key')     // Get cookie with name 'auth_key'
```

## 引数

**{% fa fa-angle-right %} name** ***(String)***

The name of the cookie to get.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.getCookie()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `responseTimeout` configuration#Timeouts %} | {% usage_options timeout cy.getCookie %}

## 実行結果 {% helper_icon yields %}

`cy.getCookie()` yields a cookie object with the following properties:

- `name`
- `value`
- `path`
- `domain`
- `httpOnly`
- `secure`
- `expiry`

***When a cookie matching the name could not be found:***

`cy.getCookie()` yields `null`.

# 例

## 引数なしの場合

***Get `session_id` cookie after logging in***

In this example, on first login, our server sends us back a session cookie.

```javascript
// assume we just logged in
cy.contains('Login').click()
cy.url().should('include', 'profile')
cy.getCookie('session_id')
  .should('have.property', 'value', '189jd09su')
```

***Using `cy.getCookie()` to test logging in***

{% note info %}
Check out our example recipes using `cy.getCookie()` to test {% url 'logging in using HTML web forms' recipes#HTML-Web-Forms %}, {% url 'logging in using XHR web forms' recipes#XHR-Web-Forms %} and {% url 'logging in with single sign on' recipes#Single-Sign-On %}
{% endnote %}

# ルール

## 条件 {% helper_icon requirements %}

{% requirements parent cy.getCookie %}

## アサーション {% helper_icon assertions %}

{% assertions once cy.getCookie %}

## タイムアウト {% helper_icon timeout %}

{% timeouts automation cy.getCookie %}

# コマンドログ

```javascript
cy.getCookie('fakeCookie1').should('have.property', 'value', '123ABC')
```

The commands above will display in the command log as:

![Command Log](/img/api/getcookie/get-browser-cookie-and-make-assertions-about-object.png)

When clicking on `getCookie` within the command log, the console outputs the following:

![Console Log](/img/api/getcookie/inspect-cookie-object-properties-in-console.png)

# こちらも参考にしてください

- {% url `cy.clearCookie()` clearcookie %}
- {% url `cy.clearCookies()` clearcookies %}
- {% url 'Cypress Cookies API' cookies %}
- {% url `cy.getCookies()` getcookies %}
- {% url `cy.setCookie()` setcookie %}
