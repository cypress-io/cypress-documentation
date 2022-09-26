const fs = require('fs');
var path = require('path');

const sortChangelogs = (a, b) => {
    // descending order
    const A_LESS_THAN_B = 1
    const A_GREATER_THAN_B = -1
    const A_EQUALS_B = 0
    const [aMaj, aMin, aPatch] = a.split('.').map((x) => Number(x))
    const [bMaj, bMin, bPatch] = b.split('.').map((x) => Number(x))
    if (aMaj > bMaj) {
      return A_GREATER_THAN_B
    }
    if (aMaj < bMaj) {
      return A_LESS_THAN_B
    }
    if (aMin > bMin) {
      return A_GREATER_THAN_B
    }
    if (aMin < bMin) {
      return A_LESS_THAN_B
    }
    if (aPatch > bPatch) {
      return A_GREATER_THAN_B
    }
    if (aPatch < bPatch) {
      return A_LESS_THAN_B
    }
    return A_EQUALS_B
  }

function readFilesSync(dir) {  
    // get files & sort desc
    const changelogs = fs.readdirSync(dir)
    const sortedChangelogs = changelogs.sort((a, b) => {
       return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
    })
    
    // .sort(sortChangelogs)
    // console.log(sortedChangelogs)
    
    sortedChangelogs.forEach(file => {
    
    const filePath = path.join('/Users/pauljaffre/cypress/cypress-documentation/docs/guides/references/_changelogs',file);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) console.log(err);
        // console.log(data.toString());
        
        fs.appendFile('/Users/pauljaffre/cypress/cypress-documentation/docs/guides/references/changelog.mdx', data.toString() + '\n', function (err) {
            if (err) return console.log(err);
         });
      });
    });
  }

  readFilesSync('/Users/pauljaffre/cypress/cypress-documentation/docs/guides/references/_changelogs')
