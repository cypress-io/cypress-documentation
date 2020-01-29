require('../spec_helper')

const snippetCreator = require('../../cy_scripts/snippet-creator/cli')

describe('Snippet Creator', () => {
  // it('can be launched as a process', () => {
  //   exec('node ../../cy_scripts/snippet-creator aaaa')
  //   // .then(unit test it)
  // })

  it('errors out if can\'t find input file', () => {
    return snippetCreator.start(['node', 'snip', 'asdf'])
    .then(snapshot)
  })

  it('errors if no argument provided', () => {
    return snippetCreator.start(['node', 'snip'])
    .then(snapshot)
  })
})
