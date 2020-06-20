const fs = require('fs');

const hex = fs.readFileSync('./addresses.txt').toString()
    .split('\n')
    .join(' ')
    .split(', ')
    .map(e => parseInt(e, 16))

const bin = hex.map(e => e.toString(2).padStart(16, "0"))

console.log(bin)