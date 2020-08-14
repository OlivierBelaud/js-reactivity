let product = { price: 5, quantity: 2 }
let total = 0

const depsMap = new Map()

let effect = () => { total = product.price * product.quantity }

let track = (key) => {
  let dep = depsMap.get(key)
  if(!dep){
    depsMap.set(key, (dep = new Set()))
  }
  dep.add(effect) 
}
let trigger = (key) => {
  let dep = depsMap.get(key)
  if(dep){
    dep.forEach(effect => effect())
  }
}

// expected : total is 0
console.log(`total is ${total}`)

// Permet d'enregistrer la fonction effect dans la liste des fonctions à re-run si changement de quantity
track('quantity')
track('price')
effect()

// expected : total is 10
console.log(`total is ${total}`)

product.quantity = 3
// Permet de re-run l'ensemble des fonctions si changement de quantity
trigger('quantity')

// expected : total is 15
console.log(`total is ${total}`)

product.price = 10
// Permet de re-run l'ensemble des fonctions si changement de quantity
trigger('price')

// expected : total is 30
console.log(`total is ${total}`)