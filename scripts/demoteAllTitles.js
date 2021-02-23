const fs = require('fs')

module.exports.demoteAllTitles = (filepath) => {
  const data = fs.readFileSync(filepath, 'utf8')
  const lines = data.split(/\r?\n/)

  let didFindH1 = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // behold this magnum opus
    // _chef's kiss gesture with hand_
    const containsTitle =
      line.startsWith('# ') ||
      line.startsWith('## ') ||
      line.startsWith('### ') ||
      line.startsWith('#### ') ||
      line.startsWith('##### ') ||
      line.startsWith('###### ') ||
      line.startsWith('####### ') ||
      line.startsWith('######## ')

    const isH1Title = line.startsWith('# ')

    if (isH1Title && !didFindH1) {
      didFindH1 = true
    }

    if (containsTitle) {
      lines[i] = `#${  line}`
    }
  }

  // This makes the transform idempotent.
  // If we do not find any `#` (or h1) titles,
  // we assume that this transform has already been ran.
  if (!didFindH1) {
    return
  }

  const newData = lines.join('\n').concat('\n')

  fs.writeFileSync(filepath, newData)
}
