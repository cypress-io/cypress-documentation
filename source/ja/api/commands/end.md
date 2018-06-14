---
title: end

---

End a chain of commands.


# シンタックス

```javascript
.end()
```

## 使い方

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.contains('ul').end()   // Yield 'null' instead of 'ul' element
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.end()                  // Does not make sense to chain off 'cy'
```

## 実行結果 {% helper_icon yields %}

{% yields null .end %}

# 例

`.end()` is useful when you want to end a chain of commands and force the next command to not receive what was yielded in the previous command.

```javascript
cy
  .contains('User: Cheryl').click().end() // yield null
  .contains('User: Charles').click()      // contains looks for content in document now
```

Alternatively, you can always start a new chain of commands of of `cy`.


```javascript
cy.contains('User: Cheryl').click()
cy.contains('User: Charles').click()  // contains looks for content in document now
```

# ルール

## 条件 {% helper_icon requirements %}

{% requirements child .end %}

## アサーション {% helper_icon assertions %}

{% assertions none .end %}

## タイムアウト {% helper_icon timeout %}

{% timeouts none .end %}

# コマンドログ

- `.end()` does *not* log in the command log

# こちらも参考にしてください

- {% url `.root()` root %}
- {% url `.within()` within %}
