const fs = require('fs');


function possibilities(len) {
    const size = Math.pow(2, len)
    return [...Array(size).keys()].map(e => e.toString(2).padStart(len, "0"))
}

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
                if (struct[line].data.includes(e)) {
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

const result = directMapping('bin.txt', 9, 3, 3)
fs.writeFileSync('resultado.txt', (JSON.stringify(result)))