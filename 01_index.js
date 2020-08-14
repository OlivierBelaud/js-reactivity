let price = 5
let quantity = 2
let total = 0

let effect = () => { total = price * quantity }

// expected : total is 0
console.log(`total is ${total}`)

effect()

// expected : total is 10
console.log(`total is ${total}`)

quantity = 3

// expected : total is 10
console.log(`total is ${total}`)
