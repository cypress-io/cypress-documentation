const NEWLINE = '\n'

export function createDirective(ctx: any, tagName: string) {
  // match to determine if the line is an opening tag
  const tag = `:::${tagName}`
  const regex = new RegExp(`${tag}(?: *(.*))?\n`)

  // the tokenizer is called on blocks to determine if there is a directive present and create tags for it
  function blockTokenizer(this: any, eat, value, silent) {
    // stop if no match or match does not start at beginning of line
    const match = regex.exec(value)
    if (!match || match.index !== 0) return false
    // if silent return the match
    if (silent) return true

    const now = eat.now()
    const [opening] = match
    const food: any[] = []
    const content: any[] = []

    // consume lines until a closing tag
    let idx = 0
    while ((idx = value.indexOf(NEWLINE)) !== -1) {
      // grab this line and eat it
      const next = value.indexOf(NEWLINE, idx + 1)
      const line =
        next !== -1 ? value.slice(idx + 1, next) : value.slice(idx + 1)
      food.push(line)
      value = value.slice(idx + 1)
      // the closing tag is NOT part of the content
      if (line.startsWith(':::')) break
      content.push(line)
    }
    ;``
    // consume the processed tag and replace escape sequences
    const contentString = content.join(NEWLINE)
    const add = eat(opening + food.join(NEWLINE))

    // parse the content in block mode
    const exit = this.enterBlock()
    const contentNodes = this.tokenizeBlock(contentString, now)
    exit()

    const nodes = {
      type: 'containerDirective',
      data: {
        hName: tagName,
      },
      children: contentNodes,
    }
    return add(nodes)
  }

  // add tokenizer to parser after fenced code blocks
  const Parser = ctx.Parser.prototype
  Parser.blockTokenizers[tagName] = blockTokenizer
  Parser.blockMethods.splice(
    Parser.blockMethods.indexOf('fencedCode') + 1,
    0,
    tagName
  )
}
