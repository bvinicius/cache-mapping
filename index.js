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

function associativeMapping(_binfile, _rows, _tag, _words) {
    let hit = 0
    let miss = 0
    const bin = fs.readFileSync(_binfile).toString().split('\n')
    let cache = []

    fs.writeFileSync('gabarito.txt', '')

    for(let i = 0; i < _rows; i ++) {
        cache.push({
            tag: '',
            data: []
        })
    }

    // console.log('cache', cache[0])
    let count = 0

    bin.forEach(e => {
        const addressTag = e.slice(0, _tag)
        const tags = cache.map(e => e.tag)

        if (tags.includes(addressTag)) {
            const index = tags.indexOf(addressTag)
            const data = cache[index].data
            if (data.map(e => e.slice(0, 15).includes(e.slice(0, 15)))) {
                fs.appendFileSync('gabarito.txt', 'H\n')
                hit ++
            } else {
                miss ++
                fs.appendFileSync('gabarito.txt', 'M\n')
                cache[count].tag = addressTag
                cache[count].data = possibilities(_words).map(w => addressTag.concat(w).concat('0'))
                count ++
                if (count == _rows) count = 0
            }
        } else {
            miss ++
            fs.appendFileSync('gabarito.txt', 'M\n')
            cache[count].tag = addressTag
            cache[count].data = possibilities(_words).map(w => addressTag.concat(w).concat('0'))
            count ++
            if (count >= _rows) count = 0
        }

    })

    return {
        miss: miss,
        hit: hit,
        total: miss + hit
    }
}

const result = associativeMapping('bin.txt', 16, 13, 2)
console.log(result)
fs.writeFileSync('resultado.txt', (JSON.stringify(result)))

// fs.writeFileSync('hex', possibilities(4).map(e => e.toString()))