const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('/Users/sujalpipaliya/led light/catalogue_new.pdf');
pdf(dataBuffer).then(function(data) {
    const lines = data.text.split('\n');
    let currentLine = 0;
    while(currentLine < lines.length) {
        if(lines[currentLine].toLowerCase().includes('body colour:')) {
            console.log("Found:", lines[currentLine]);
        } else if(lines[currentLine].toLowerCase().includes('body colour')) {
             console.log("Found:", lines[currentLine], lines[currentLine+1]);
        }
        currentLine++;
    }
}).catch(e => console.error(e));
