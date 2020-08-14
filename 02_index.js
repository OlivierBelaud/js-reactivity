let price = 5
let quantity = 2
let total = 0

let dep = new Set()

let effect = () => { total = price * quantity }

let track = () => { dep.add(effect)}
let trigger = () => { dep.forEach(effect => effect())}

// expected : total is 0
console.log(`total is ${total}`)

track()
trigger()

// expected : total is 10
console.log(`total is ${total}`)

quantity = 3

// expected : total is 10
console.log(`total is ${total}`)
