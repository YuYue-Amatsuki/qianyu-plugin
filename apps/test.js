
let bscfg = {
    isChieseTime: false,
    isImg: false,
    isCored: false,
    character: '可莉'
}

let bs = {
    isChieseTime: false,
    isImg: true,
    isCored: false
}

bscfg = { ...bscfg, ...null }
console.log(bscfg);