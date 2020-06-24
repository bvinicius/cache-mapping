const fs = require('fs');

const hex = fs.readFileSync('./addresses.txt').toString()
    .split('\n')
    .join(' ')
    .split(', ')
    .map(e => parseInt(e, 16))

const bin = hex.map(e => e.toString(2).padStart(16, "0"))

function possibilities(len) {
    const size = Math.pow(2, len)
    return [...Array(size).keys()].map(e => e.toString(2).padStart(len, "0"))
}

console.log(possibilities(4))