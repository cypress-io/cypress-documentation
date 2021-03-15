/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')
const replace = require('replace-in-file')
const Promise = require('bluebird')
const YAML = require('yamljs')
const glob = require('glob')
const findDeep = require('deepdash/findDeep')
const { createAssertionListItems } = require('./assertions')
const { createYieldsListItems } = require('./yields')
const { createRequirementsListItems } = require('./requirements')
const { createTimeoutsListItems } = require('./timeouts')
const { createUsageOptions } = require('./usageOptions')
const partials = require('./partials')
const { demoteAllTitles } = require('./demoteAllTitles')
const { convertYamlFilesToJson } = require('./convertYamlFilesToJson')

const MD_FILES = '/**/*.md'

const CONTENT_DIRS = [
  path.join(__dirname, '../content/api', MD_FILES),
  path.join(__dirname, '../content/examples', MD_FILES),
  path.join(__dirname, '../content/faq', MD_FILES),
  path.join(__dirname, '../content/guides', MD_FILES),
  path.join(__dirname, '../content/plugins', MD_FILES),
  path.join(__dirname, '../content/_changelogs', MD_FILES),
  path.join(__dirname, '../content', MD_FILES),
]

const getSidebar = () => {
  const JSON_FILE = path.join(__dirname, '../content/_data/sidebar.json')
  const YML_FILE = path.join(__dirname, '../content/_data/sidebar.yml')
  const doesSidebarJSONExist = fs.existsSync(JSON_FILE)

  if (fs.existsSync(JSON_FILE)) {
    return require(JSON_FILE)
  }

  try {
    return YAML.load(YML_FILE)
  } catch (error) {
    if (!doesSidebarJSONExist) {
      throw error
    }
  }
}

const sidebar = getSidebar()

const sidebarLookup = (term) => findDeep(sidebar, (value, key) => key === term)

// removes wrapping quotes
const unquotify = (content = '') => {
  const isWrappedWithSingleQuotes =
    content.startsWith("'") && content.endsWith("'")
  const isWrappedWithDoubleQuotes =
    content.startsWith('"') && content.endsWith('"')

  if (isWrappedWithSingleQuotes || isWrappedWithDoubleQuotes) {
    return unquotify(content.slice(1, content.length - 1))
  }

  return content
}

// Icons
// https://regexr.com/5l0oj
const iconTransform = (files) => {
  return {
    files,
    from: /{% fa\sfa-([a-z-]+)\s+(fa-fw)*\s*([a-z]*)\s*%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, name, className, color] = match

      // The keys of this object exist in the current docs as icons.
      // These icon names are deprecated. Their corresponding values are
      // the updated names for these icons.
      const FONTAWESOME_ICON_MAP = {
        warning: 'exclamation-triangle',
      }

      const iconName = FONTAWESOME_ICON_MAP[name]
        ? FONTAWESOME_ICON_MAP[name]
        : name

      return `<Icon name="${iconName}"${
        className ? ` className="${className}"` : ''
      }${color ? ` color="${color}"` : ''}></Icon>`
    },
  }
}

// Url External
// {% url Chai#expect https://www.chaijs.com/guide/styles/#expect %}
// [Chai#expect](https://www.chaijs.com/guide/styles/#expect)
// https://regexr.com/au4u
const urlExternalTransform = (files) => {
  return {
    files,
    from: /{%\s*url\s+'*([^{%]*?)'*\s+['"]*(?=http)(.*?)['"]*\s*%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, content, url] = match

      return `[${unquotify(content)}](${url})`
    },
  }
}

// Url External without content (only a hyperlink)
// https://regexr.com/5koa1
const urlExternalLinkTransform = (files) => {
  return {
    files,
    from: /{%\s*url\s+'*(?=http)(.*?)'*\s*%}/g,
    to: '[$1]($1)',
  }
}

// Url Relative
// {% url about /about %}
// [about](/about)
// https://regexr.com/5kosg
const urlRelativeTransform = (files) => {
  return {
    files,
    from: /{%\s+url\s+'*(.*?)'*\s+(?=\/)([^{%]*?)\s+%}/g,
    to: '[$1]($2)',
  }
}

const urlTransform = (files) => {
  return {
    files,
    // from: /{%\s*url\s+(.*)\s*%}/g,
    from: /{%\s*url\s+[^{%]+\s*%}/g,
    to: (...match) => {
      const [hexoTag] = match

      const hexoTagBody = hexoTag // {% url "`cy.should('contain', '...')`" should %}
        .slice(2, hexoTag.length - 2) // url "`cy.should('contain', '...')`" should
        .trim()
        .replace('url', '') // "`cy.should('contain', '...')`" should
        .trim()

      const quoteType = hexoTagBody[0]
      const isEnclosedInQuotes = quoteType === '"' || quoteType === "'"
      const END_CONTENT_INDEX = hexoTagBody.lastIndexOf(
        isEnclosedInQuotes ? quoteType : ' '
      )
      const tagContent = hexoTagBody.slice(
        isEnclosedInQuotes ? 1 : 0,
        END_CONTENT_INDEX
      )
      const tagPath = hexoTagBody.slice(END_CONTENT_INDEX + 1).trim()
      const [slug, maybeAnchor] = tagPath.split('#')

      const item = sidebarLookup(slug)

      if (item) {
        // console.log('Path: ', item.context.path);
        const path = item.context.path
          .replace(/\./g, '/')
          .replace(/\["/g, '/')
          .replace(/"\]/g, '')

        // console.log('path: ', path)

        let filename = item.value.replace('.html', '')

        // console.log('filename: ', filename)

        let result

        // if filename is in path
        if (path.includes(filename)) {
          // console.log('path includes filename')
          // console.log('path: ', path)
          // console.log('filename: ', filename)

          let pathToAppend = path

          // append anchor if present
          if (maybeAnchor) {
            pathToAppend = `${path}#${maybeAnchor}`
          }

          result = `[${tagContent}](/${pathToAppend})`
        } else {
          // console.log('path does NOT include filename')
          if (maybeAnchor) {
            filename = `${filename}#${maybeAnchor}`
          }

          result = `[${tagContent}](/${path}/${filename})`
        }

        // console.log('RESULT: ', result, "\n\n")
        return result
      }

      return hexoTag
    },
  }
}

// Url Hash
// {% urlHash 'Set up tests' Setting-up-tests %}
// {% urlHash 'Write tests' Writing-tests %}
// {% urlHash 'Run tests' Running-tests %}
// {% urlHash 'Debug Tests' Debugging-tests %}
//
// [Set up tests](#Setting-up-tests)
// [Write tests](#Writing-tests)
// [Run tests](#Running-tests)
// [Debug Tests](Debugging-tests)
// https://regexr.com/5fgcc
const urlHashTransform = (files) => {
  return {
    files,
    // eslint-disable-next-line no-useless-escape
    from: /{%\s+urlHash\s+['"`]*(.[^'"`]+)['"`]*\s+['"`]*([a-zA-z0\-]+)['"`]*\s+%}/g,
    to: '[$1](#$2)',
  }
}

const urlHashDoubleQuoteTransform = (files) => {
  return {
    files,
    from: /{%\s+urlHash\s+"*([^"]+)"*\s+([^'"`]+)\s+%}/g,
    to: '[$1](#$2)',
  }
}

const urlHashSingleQuoteTransform = (files) => {
  return {
    files,
    from: /{%\s+urlHash\s+'*([^']+)'*\s+([^'"`]+)\s+%}/g,
    to: '[$1](#$2)',
  }
}

// Url Internal (keyword)
// {% url `.and()` and %}
// [`.and()`](/api/commands/and)
// https://regexr.com/5bdi5
const urlInternalTransform = (files) => {
  return {
    files,
    from: /{%\s*url\s+['"`]*([\w-:.()\s]*)['"`]*\s+(.*?)\s*%}/g,
    to: (match, one, two) => {
      // console.log('Orig:', match);
      // console.log('one:', one)
      // console.log('two:', two)

      const term = two.match(/#/) ? two.split('#')[0] : two

      const item = sidebarLookup(term)

      // console.log('Lookup: ', term);
      if (item) {
        // console.log('Path: ', item.context.path);
        const path = item.context.path
          .replace(/\./g, '/')
          .replace(/\["/g, '/')
          .replace(/"\]/g, '')

        // console.log('path: ', path)

        let filename = item.value.replace('.html', '')

        // console.log('filename: ', filename)

        let result

        // if filename is in path
        if (path.includes(filename)) {
          // console.log('path includes filename')
          // console.log('path: ', path)
          // console.log('filename: ', filename)

          let pathToAppend = path

          // append anchor if present
          if (two.match(/#/)) {
            pathToAppend = `${path}#${two.split('#')[1]}`
          }

          result = `[${one}](/${pathToAppend})`
        } else {
          // console.log('path does NOT include filename')
          if (two.match(/#/)) {
            filename = `${filename}#${two.split('#')[1]}`
          }

          result = `[${one}](/${path}/${filename})`
        }

        // console.log('RESULT: ', result, "\n\n")
        return result
      }

      return match
    },
  }
}

// The regex for urlInternalTransform does not match:
// {% url `.type('{selectall}{backspace}')` type %}
const urlInternalBacktickTransform = (files) => {
  return {
    files,
    from: /{%\s*url\s+`([^`]*)`*\s+(.*?)\s*%}/g,
    to: (match, one, two) => {
      // console.log('Orig:', match);
      // console.log('one:', one)
      // console.log('two:', two)

      const term = two.match(/#/) ? two.split('#')[0] : two

      const item = sidebarLookup(term)

      // console.log('Lookup: ', term);
      if (item) {
        // console.log('Path: ', item.context.path);
        const path = item.context.path
          .replace(/\./g, '/')
          .replace(/\["/g, '/')
          .replace(/"\]/g, '')

        // console.log('path: ', path)

        let filename = item.value.replace('.html', '')

        // console.log('filename: ', filename)

        let result

        // if filename is in path
        if (path.includes(filename)) {
          // console.log('path includes filename')
          // console.log('path: ', path)
          // console.log('filename: ', filename)

          let pathToAppend = path

          // append anchor if present
          if (two.match(/#/)) {
            pathToAppend = `${path}#${two.split('#')[1]}`
          }

          result = `[\`${one}\`](/${pathToAppend})`
        } else {
          // console.log('path does NOT include filename')
          if (two.match(/#/)) {
            filename = `${filename}#${two.split('#')[1]}`
          }

          result = `[\`${one}\`](/${path}/${filename})`
        }

        // console.log('RESULT: ', result, "\n\n")
        return result
      }

      return match
    },
  }
}

// https://regexr.com/5ojtn
const urlChangelogTransform = (files) => {
  return {
    files,
    from: /{%\s+url\s+"[0-9]+\.[0-9]+\.[0-9]+"\s+changelog-([0-9]+)[.-]([0-9]+)[.-]([0-9]+)\s+%}/g,
    to: '[$1.$2.$3](#$1-$2-$3)',
  }
}

const urlCatchAllTransform = (files) => {
  return {
    files,
    from: /{%\s*url\s+['"]*([^'"]*)['"]*\s+['"]*([^{%]*?)['"]*\s*%}/g,
    to: (match, one, two) => {
      // console.log('Orig:', match);
      // console.log('one:', one)
      // console.log('two:', two)

      const term = two.match(/#/) ? two.split('#')[0] : two

      const item = sidebarLookup(term)

      // console.log('Lookup: ', term);
      if (item) {
        // console.log('Path: ', item.context.path);
        const path = item.context.path
          .replace(/\./g, '/')
          .replace(/\["/g, '/')
          .replace(/"\]/g, '')

        // console.log('path: ', path)

        let filename = item.value.replace('.html', '')

        // console.log('filename: ', filename)

        let result

        // if filename is in path
        if (path.includes(filename)) {
          // console.log('path includes filename')
          // console.log('path: ', path)
          // console.log('filename: ', filename)

          let pathToAppend = path

          // append anchor if present
          if (two.match(/#/)) {
            pathToAppend = `${path}#${two.split('#')[1]}`
          }

          result = `[${one}](/${pathToAppend})`
        } else {
          // console.log('path does NOT include filename')
          if (two.match(/#/)) {
            filename = `${filename}#${two.split('#')[1]}`
          }

          result = `[${one}](/${path}/${filename})`
        }

        // console.log('RESULT: ', result, "\n\n")
        return result
      }

      return match
    },
  }
}

// Image
// {% imgTag /img/api/should/should-command-shows-up-as-assert-for-each-assertion.png "Command Log should" %}
// <DocsImage src="/img/api/should/should-command-shows-up-as-assert-for-each-assertion.png" alt="Command Log should"></DocsImage>
// https://regexr.com/5b0e8
const imageTransform = (files) => {
  return {
    files,
    from: /{%\s*imgTag\s['"]*(?=\/)(.*?)['"]*\s+(.*)\s*%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, src, alt] = match

      return `<DocsImage src="${src}" alt=${alt}></DocsImage>`
    },
  }
}

const shortImageTransform = (files) => {
  return {
    files,
    from: /{%\s*imgTag\s['"]*(?=\/)(.*?)['"]*\s*%}/g,
    to: '<DocsImage src="$1"></DocsImage>',
  }
}

const imgTagTransform = (files) => {
  return {
    files,
    from: /{%\s*img\s*['"]*(?=\/)(.*?)['"]*\s*%}/g,
    to: '<DocsImage src="$1"></DocsImage>',
  }
}

// {% imgTag /img/guides/real-world-app.png  "Cypress Real World App" "no-border" %}
const imageTransformWithStyles = (files) => {
  return {
    files,
    from: /{%\s+imgTag\s(?=\/)([^"]*?)\s+"([^"]*?)"\s+"([^"]*?)*"\s+%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, src, alt] = match

      return `<DocsImage src="${src}" alt="${alt}"></DocsImage>`
    },
  }
}

// Video
// {% video /videos/api/intro.mp4 %}
// <DocsVideo path="/videos/api/intro.mp4"></DocsVideo>
// https://regexr.com/5b0ee
const videoTransform = (files) => {
  return {
    files,
    from: /{%\s+video\s(?=\/)(.*?)\s+%}/g,
    to: '<DocsVideo src="$1"></DocsVideo>',
  }
}

// Video - YouTube, Vimeo, Local
//
// {% video youtube LcGHiFnBh3Y %}
// {% video vimeo 237115455 %}
// {% video local /img/snippets/installing-cli.mp4 %}
//
// <DocsVideo path="https://youtube.com/embed/LcGHiFnBh3Y"></DocsVideo>
// <DocsVideo path="https://vimeo.com/237115455"></DocsVideo>
// <DocsVideo path="/img/snippets/installing-cli.mp4"></DocsVideo>
// https://regexr.com/5b0ee
const videoYTVimeoTransform = (files) => {
  return {
    files,
    from: /{%\s+video\s+(\byoutube|vimeo|local\b)\s(.*?)\s%}/g,
    to: (match, one, two) => {
      const result = `<DocsVideo src="${two}"></DocsVideo>`

      if (one === 'youtube') {
        return `<DocsVideo src="https://youtube.com/embed/${two}"></DocsVideo>`
      }

      if (one === 'vimeo') {
        return `<DocsVideo src="https://vimeo.com/${two}"></DocsVideo>`
      }

      return result
    },
  }
}

const noteOpenTagTransform = (files) => {
  return {
    files,
    from: /{%\s*note\s*.*\s*%}/g,
    to: (...match) => {
      // {%note%}
      // {% note %}
      // {% note info %}
      // {% note info%}
      // {% note info "hello world" %}
      // {% note info "hello world"%}
      const [hexoTag] = match
      const LENGTH_OF_OPEN_OR_CLOSE = 2
      // eslint-disable-next-line no-unused-vars
      const [_note, type, ...subheaderParts] = hexoTag
        .slice(
          LENGTH_OF_OPEN_OR_CLOSE,
          hexoTag.length - LENGTH_OF_OPEN_OR_CLOSE
        )
        .trim()
        .split(' ')

      if (!type) {
        return `<Alert>\n`
      }

      const subheader = unquotify(subheaderParts.join(' '))

      if (subheader) {
        return `<Alert type="${type}">\n\n <strong class="alert-header">${subheader}</strong>\n`
      }

      if (type) {
        return `<Alert type="${type}">\n\n`
      }

      // A type or subheader should always be present, so this is a fallback
      return `<Alert>\n\n`
    },
  }
}

const noteCloseTagTransform = (files) => {
  return {
    files,
    from: /{%\s*endnote\s*%}/g,
    to: `\n</Alert>`,
  }
}

// {% assertions utility .as %}
// regexr.com/5fglc
const assertionTransform = (files) => {
  return {
    files,
    from: /{%\s+assertions\s+(.+[^\W])\s+(.*)\s+%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, type, cmd] = match
      // console.log('type: ', type, '\n')
      // console.log('cmd: ', cmd, '\n')
      const listItems = createAssertionListItems(type, cmd)

      return `<List>${listItems
        .map((content) => `<li>${content}</li>`)
        .join('')}</List>`
    },
  }
}

// {% yields sets_subject cy.readFile 'yields the contents of the file' %}
// {% yields assertion_indeterminate .should %}
// regexr.com/5fldt
const yieldsTransform = (files) => {
  return {
    files,
    from: /{%\s+yields\s+(\S+)\s+(\S+)\s+([`|'|"].+[`|'|"]\s)*%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, type, cmd, content] = match
      // console.log('type: ', type)
      // console.log('cmd: ', cmd)
      const listItems = createYieldsListItems(type, cmd, content)

      return `<List>${listItems
        .map((content) => `<li>${content}</li>`)
        .join('')}</List>`
    },
  }
}

const HELPER_ICON_LINK_MAP = {
  yields: '/guides/core-concepts/introduction-to-cypress#Subject-Management',
  timeout: '/guides/core-concepts/introduction-to-cypress#Timeouts',
  assertions: '/guides/core-concepts/introduction-to-cypress#Assertions',
  requirements:
    '/guides/core-concepts/introduction-to-cypress#Chains-of-Commands',
}

const helperIconTransform = (files) => {
  return {
    files,
    from: /{%\s+helper_icon\s+(\S*)\s+%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, type] = match
      const link = HELPER_ICON_LINK_MAP[type]

      if (!link) {
        throw new Error(
          `{% helper_icon %} tag helper was provided an invalid type: ${type}`
        )
      }

      return `[<Icon name="question-circle"/>](${link})`
    },
  }
}

// regexr.com/5fsjg
const requirementsTransform = (files) => {
  return {
    files,
    from: /{%\srequirements\s+(\S*)\s+(\S*)\s+%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, type, cmd] = match
      const listItems = createRequirementsListItems(type, cmd)

      return `<List>${listItems
        .map((content) => `<li>${content}</li>`)
        .join('')}</List>`
    },
  }
}

const timeoutsTransform = (files) => {
  return {
    files,
    from: /{%\stimeouts\s+(\S*)\s+(\S*)\s+%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, type, cmd] = match
      const listItems = createTimeoutsListItems(type, cmd)

      return `<List>${listItems
        .map((content) => `<li>${content}</li>`)
        .join('')}</List>`
    },
  }
}

const shortUsageOptionsTransform = (files) => {
  return {
    files,
    from: /{%\susage_options\s+([^{%]*)\s+%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, option, type] = match
      const blurb = createUsageOptions(option, type)

      return blurb
    },
  }
}

const usageOptionsTransform = (files) => {
  return {
    files,
    from: /{%\susage_options\s+([^{%]*)\s+([^{%]*)\s+%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, option, type] = match
      const blurb = createUsageOptions(option, type)

      return blurb
    },
  }
}

const historyTransform = (files) => {
  return {
    files,
    from: /{%\shistory\s%}\n(.*?)\n{%\sendhistory\s%}/gs,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, content] = match
      const tableMarkdown = `Version | Changes\n--- | ---\n`
      const table = `${tableMarkdown}${content}`

      return `## History\n\n${table}`
    },
  }
}

const aliasesTransform = (files) => {
  return {
    files,
    from: /{%\saliases\s+(.*)\s+%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, aliases] = match
      const aliasList = aliases.split(' ').join(', ')

      return `<br><small class="aliases"><strong>Aliases: </strong>${aliasList}</small>`
    },
  }
}

const openAnIssueWithArgTransform = (files) => {
  return {
    files,
    from: /{%\s+open_an_issue\s+(.*)\s+%}/g,
    to: () => {
      return `[open an issue](https://github.com/cypress-io/cypress/issues/new)`
    },
  }
}

const openAnIssueTransform = (files) => {
  return {
    files,
    from: /{%\s+open_an_issue\s+%}/g,
    to: () => {
      return `[open an issue](https://github.com/cypress-io/cypress/issues/new)`
    },
  }
}

// {% issue 1234 %}
// {% issue 7 %}
// no text after the issue number
const shortIssueTransform = (files) => {
  return {
    files,
    from: /{%\s+issue\s+([^{%'"`]*)\s+%}/g,
    to: `[#$1](https://github.com/cypress-io/cypress/issues/$1)`,
  }
}

// {% issue 7 '#7' %}
// includes text after the issue number
// https://regexr.com/5kokt
const longIssueTransform = (files) => {
  return {
    files,
    from: /{%\s+issue\s+([^{%]*)\s+['"`]([^{%]*)['"`]\s+%}/g,
    to: `[$2](https://github.com/cypress-io/cypress/issues/$1)`,
  }
}

const badgeTransform = (files) => {
  return {
    files,
    from: /{%\s+badge\s+(.*)\s+%}/g,
    to: (...match) => {
      const [hexoTag] = match
      const splitTag = hexoTag.split(' ')
      // ['{%', 'badge', 'success', 'After', '%}']
      const typeIndex = 2
      const contentIndex = 3
      const type = splitTag[typeIndex]
      const content = splitTag[contentIndex]

      return `<Badge type="${type}">${content}</Badge>`
    },
  }
}

const partialTransform = (files) => {
  return {
    files,
    from: /{%\s+partial\s+(.*)\s+%}/g,
    to: (...match) => {
      // eslint-disable-next-line no-unused-vars
      const [_hexoTag, type] = match
      const partialType = type.toUpperCase()

      if (!partials[partialType]) {
        throw new Error(`Unrecognized partial: ${type}`)
      }

      return partials[partialType]
    },
  }
}

const rawTransform = (files) => {
  return {
    files,
    from: /{% raw %}/g,
    to: '', // remove it
  }
}

const endRawTransform = (files) => {
  return {
    files,
    from: /{% endraw %}/g,
    to: '', // remove it
  }
}

const pullRequestTransform = (files) => {
  return {
    files,
    from: /{%\s*PR ([0-9]+)\s*%}/g,
    to: '[#$1](https://github.com/cypress-io/cypress/pull/$1)',
  }
}

const main = () => {
  const fileList = glob.sync(path.join(__dirname, '../content', MD_FILES))

  try {
    fileList.forEach(demoteAllTitles)
  } catch (error) {
    console.error('😢 Failed to change titles in markdown files:', error)
  }

  try {
    convertYamlFilesToJson(path.join(__dirname, '../content'))
  } catch (error) {
    console.error('😢 Failed to convert .yml files to .json:', error)
  }

  CONTENT_DIRS.forEach((files) => {
    Promise.reduce(
      [
        partialTransform(files),
        iconTransform(files),
        aliasesTransform(files),
        assertionTransform(files),
        historyTransform(files),
        requirementsTransform(files),
        timeoutsTransform(files),
        yieldsTransform(files),
        usageOptionsTransform(files),
        shortUsageOptionsTransform(files),
        helperIconTransform(files),
        urlHashTransform(files),
        urlHashDoubleQuoteTransform(files),
        urlHashSingleQuoteTransform(files),
        urlExternalTransform(files),
        urlExternalLinkTransform(files),
        urlRelativeTransform(files),
        urlInternalBacktickTransform(files),
        urlInternalTransform(files), // must come last in url processing
        urlTransform(files),
        urlChangelogTransform(files),
        urlCatchAllTransform(files),
        imageTransformWithStyles(files),
        imageTransform(files),
        shortImageTransform(files),
        imgTagTransform(files),
        videoTransform(files),
        videoYTVimeoTransform(files),
        noteOpenTagTransform(files),
        noteCloseTagTransform(files),
        openAnIssueWithArgTransform(files),
        openAnIssueTransform(files),
        longIssueTransform(files), // must come before shortIssueTransform
        shortIssueTransform(files),
        badgeTransform(files),
        rawTransform(files),
        endRawTransform(files),
        pullRequestTransform(files),
      ],
      function (output, options) {
        return replace(options)
      },
      []
    ).then(function (total) {
      console.log(`${files} Done.`)
    })
  })
}

main()
