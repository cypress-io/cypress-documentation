/**
 * Indents the given string
 * @param {string} str  The string to be indented.
 * @param {number} numOfIndents  The amount of indentations to place at the
 *     beginning of each line of the string.
 * @param {number=} opt_spacesPerIndent  Optional.  If specified, this should be
 *     the number of spaces to be used for each tab that would ordinarily be
 *     used to indent the text.  These amount of spaces will also be used to
 *     replace any tab characters that already exist within the string.
 * @return {string}  The new string with each line beginning with the desired
 *     amount of indentation.
 */
module.exports.indent = (str, numOfIndents, opt_spacesPerIndent) => {
  str = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('\t'))
  numOfIndents = new Array(opt_spacesPerIndent + 1 || 0).join(' ') // re-use

  return opt_spacesPerIndent
    ? str.replace(/^\t+/g, function (tabs) {
        return tabs.replace(/./g, numOfIndents)
      })
    : str
}
