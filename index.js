const fs = require('fs');
const { strict } = require('assert');

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

function directMapping(_binfile, _tag, _lines, _words, _bitwise) {
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
        
        console.log(lineTag)
        console.log(addressTag)

        if (lineTag) {
            if (lineTag == addressTag) {
                console.log('AQUIIIII')
                if (struct[line].data.includes(e)) {
                    hit ++
                } else {
                    miss ++
                    struct[line].data = possibilities(_words).map(w => addressTag.concat(line).concat(w).concat('0'))
                    struct[line].tag = addressTag
                }
            } else {
                miss ++
                struct[line].data = possibilities(_words).map(w => addressTag.concat(line).concat(w).concat('0'))
                struct[line].tag = addressTag
            }
        } else {
            miss ++
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

console.log(directMapping('bin.txt', 9, 3, 3, 1))

//olha o próximo endereço
    //ve se a linha do endereço ja tem coisa dentro
    //se tiver, olha a tag
        //se a tag for a mesma
            //procura na linha se aquele endereço já está lá
                //se estiver, HIT
                //se não, MISS e aquela linha é preenchida com os novos valores de acordo com o endereço
        //se não for a mesma, MISS
    //se não tiver, MISS e aquela linha é preenchida com os novos valores de acordo com o endereço