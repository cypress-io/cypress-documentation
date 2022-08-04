// https://www.npmjs.com/package/replace-in-file
const replace = require('replace-in-file')

const options = {
  files: './docs/**/*.mdx',
  // files: './docs/guides/end-to-end-testing/introduction/writing-your-first-end-to-end-test.mdx',
  from: [/#[A-Za-z-]+\)/g],
  to: (match) => match.toLowerCase(),
}

try {
  const results = replace.sync(options)
  console.log('Replacement results:', results)
} catch (error) {
  console.error('Error occurred:', error)
}
