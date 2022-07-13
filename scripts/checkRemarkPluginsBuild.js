/**
 * Check is the 'dist' directory for the Cypress Remark plugins exists, 
 * and builds the package if not. Used in the 'prestart' npm script to 
 * verify plugins are there before 'npm run start' is called.
 */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const pluginDir = './plugins/CypressRemarkPlugins/dist'

if (!fs.existsSync(path.join(process.cwd(), pluginDir))) {
  exec('npm run build:plugins', (err, stdout) => {
    if (err) {
      console.error('Error building Cypress Remark plugins:', err)
    } else {
      console.log('Done building Cypress Remark plugins')
    }
  })
}
