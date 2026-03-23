const fs = require('fs');
const pdf = require('pdf-parse');

const pdfBuffer = fs.readFileSync('/Users/sujalpipaliya/led light/catalogue_new.pdf');

pdf(pdfBuffer).then(function (data) {
    console.log(data.text);
}).catch(err => {
    console.error("Error reading PDF", err);
});
