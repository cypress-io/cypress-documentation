const { runSidebarTests } = require('./test-utils')
const sidebar = require('../../content/_data/sidebar.json')

runSidebarTests(sidebar.guides)
