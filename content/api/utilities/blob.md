---
title: Cypress.Blob
---

Cypress automatically includes a [Blob](https://github.com/nolanlawson/blob-util) library and exposes it as `Cypress.Blob`.

Use `Cypress.Blob` to convert `base64` strings to Blob objects. Useful for testing uploads.

## Syntax

```javascript
Cypress.Blob.method()
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
Cypress.Blob.method()
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.Blob.method() // Errors, cannot be chained off 'cy'
```

## Examples

### Image Fixture

#### Using an image fixture for jQuery plugin upload

```javascript
// programmatically upload the logo
cy.fixture('images/logo.png').as('logo')
cy.get('input[type=file]').then(function ($input) {
  // convert the logo base64 string to a blob
  const blob = Cypress.Blob.base64StringToBlob(this.logo, 'image/png')

  // pass the blob to the fileupload jQuery plugin
  // https://github.com/blueimp/jQuery-File-Upload
  // used in your application's code
  // which initiates a programmatic upload
  $input.fileupload('add', { files: blob })
})
```

#### Using an image fixture for upload

```javascript
// programmatically upload the logo
cy.fixture('images/logo.png').as('logo')
cy.get('input[type=file]').then(function (el) {
  // convert the logo base64 string to a blob
  const blob = Cypress.Blob.base64StringToBlob(this.logo, 'image/png')

  const file = new File([blob], 'images/logo.png', { type: 'image/png' })
  const list = new DataTransfer()

  list.items.add(file)
  const myFileList = list.files

  el[0].files = myFileList
  el[0].dispatchEvent(new Event('change', { bubbles: true }))
})
```

### Getting dataUrl string

#### Create an `img` element and set its `src` to the `dataUrl`

```javascript
return Cypress.Blob.imgSrcToDataURL('/assets/img/logo.png').then((dataUrl) => {
  const img = Cypress.$('<img />', { src: dataUrl })

  cy.get('.utility-blob').then(($div) => {
    // append the image
    $div.append(img)
  })
  cy.get('.utility-blob img').click().should('have.attr', 'src', dataUrl)
})
```

## History

| Version                               | Changes                                                                                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [5.0.0](/guides/references/changelog) | Return type of `arrayBufferToBlob`, `base64StringToBlob`, `binaryStringToBlob`, and `dataURLToBlob` methods changed from `Promise<Blob>` to `Blob` |
| [5.0.0](/guides/references/changelog) | Added `arrayBufferToBinaryString`, `binaryStringToArrayBuffer` methods.                                                                            |

## See also

- [Bundled Tools](/guides/references/bundled-tools)
