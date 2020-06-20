const fs = require('fs');

const hex = fs.readFileSync('./input.txt').toString()
    .split('\n')
    .join(' ')
    .split(', ')