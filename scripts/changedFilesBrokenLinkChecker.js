const execSync = require('child_process').execSync

const GIT_DIFF_NAME_STATUS_LAST_COMMIT = 'git diff --name-status HEAD~1'
const MARKDOWN_EXTENSION = '.md'

const isMarkdownFile = (line) => line.endsWith(MARKDOWN_EXTENSION)
const isDeletedFile = (line) => line.startsWith('D\t')

const removeStatus = (line) => {
  // Each line will have a prefix of one of the following letters:
  // M (modified),
  // C (changed),
  // R (removed),
  // A (added),
  // D (deleted),
  // U (unmerged; file has conflicts after merge)
  // The letter will be followed by a tab: '\t'
  const STATUS_LENGTH = 3
  return line.slice(STATUS_LENGTH)
}

const main = () => {
  const MARKDOWN_EXTENSION = '.md'

  const changedFiles = execSync(GIT_DIFF_NAME_STATUS_LAST_COMMIT)
    .toString()
    .split('\n')
    .filter((line) => line.endsWith(MARKDOWN_EXTENSION))

  console.log(changedFiles)
}

main()
