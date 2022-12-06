const fs = require('fs')
const path = require('path');

async function readwriteChangelogs(dirPath) {
  try {
      // get changelogs & sort desc
      const changelogs = await fs.promises.readdir(dirPath);
      const sortedChangelogs = changelogs.sort((a, b) => {
        return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
      });
    
     // read each changlelog file to get contents
     for (const file of sortedChangelogs) {
        const filePath = path.join(dirPath, file);
        const contents = await fs.promises.readFile(filePath, { encoding: 'utf8' })
        // write each file to new location
        fs.promises.appendFile(path.resolve('./docs/guides/references/', 'changelog.mdx'), contents.toString() + '\n', (err) => {
            if (err) return console.log(err);
        });
      }
      console.log('files written!!');
    } catch (err) {
      console.error(err);
    }
} 

readwriteChangelogs(path.resolve('./docs/guides/references/_changelogs'))