const fs = require('fs');

function possibilities(len) {
    const size = Math.pow(2, len)
    return [...Array(size).keys()].map(e => e.toString(2).padStart(len, "0"))
}

const hex = fs.readFileSync('bin.txt').toString()
    .split('\n')
    .map(e => parseInt(e, 2))
    .map(e => e.toString(16))

hex.forEach(e => fs.appendFileSync('hex.txt', e + '\n'))

function directMapping(_binfile, _tag, _lines, _words) {
    fs.writeFileSync('gabarito.txt', '')

    const bin = fs.readFileSync(_binfile).toString().split('\n')
    const struct = {}

    possibilities(_lines).forEach(e => {
        Object.assign(struct, {[e]: {
            tag: "",
            data: []
        }})
    })

    let miss = 0, hit = 0
    bin.forEach(e => {
        const line = e.slice(_tag, _tag + _lines)
        const lineTag = struct[line].tag
        const addressTag = e.slice(0, _tag)
        
        if (lineTag) {
            if (lineTag == addressTag) {
                if (struct[line].data.map(e => e.slice(0, 15)).includes(e.slice(0, 15))) {
                    fs.appendFileSync('gabarito.txt', 'H\n')
                    hit ++
                } else {
                    miss ++
                    fs.appendFileSync('gabarito.txt', 'M\n')
                    struct[line].data = possibilities(_words).map(w => addressTag.concat(line).concat(w).concat('0'))
                    struct[line].tag = addressTag
                }
            } else {
                miss ++
                fs.appendFileSync('gabarito.txt', 'M\n')
                struct[line].data = possibilities(_words).map(w => addressTag.concat(line).concat(w).concat('0'))
                struct[line].tag = addressTag
            }
        } else {
            miss ++
            fs.appendFileSync('gabarito.txt', 'M\n')
            struct[line].data = possibilities(_words).map(w => addressTag.concat(line).concat(w).concat('0'))
            struct[line].tag = addressTag
        }
    })
    
    return {
        miss: miss,
        hit: hit,
        total: miss + hit
    }
}

function associativeMapping(_tag, _word) {

}

const result = directMapping('bin.txt', 9, 4, 2)
fs.writeFileSync('resultado.txt', (JSON.stringify(result)))

fs.writeFileSync('hex', possibilities(4).map(e => e.toString()))
