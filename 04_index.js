let product = { price: 5, quantity: 2 }
let product2 = { price: 10, quantity: 3 }
let total = 0

const targetMap = new WeakMap()

let effect = () => { total = product.price * product.quantity }

let track = (target, key) => {
  let depsMap = targetMap.get(target)
  if(!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if(!dep){
    depsMap.set(key, (dep = new Set()))
  }
  dep.add(effect) 
}

let trigger = (target, key) => {
  let depsMap = targetMap.get(target)
  if(!depsMap) { return }
  let dep = depsMap.get(key)
  if(dep){
    dep.forEach(effect => effect())
  }
}

// expected : total is 0
console.log(`total is ${total}`)

// Permet d'enregistrer la fonction effect dans la liste des fonctions à re-run si changement de quantity
track(product,'quantity')
track(product,'price')
effect()

// expected : total is 10
console.log(`total is ${total}`)

product.quantity = 3
// Permet de re-run l'ensemble des fonctions si changement de quantity
trigger(product,'quantity')

// expected : total is 15
console.log(`total is ${total}`)

product.price = 10
// Permet de re-run l'ensemble des fonctions si changement de quantity
trigger(product,'price')

// expected : total is 30
console.log(`total is ${total}`)

// Jusque là nou savons réussi à sauvegarder nos effects en fonctions des objects réactifs
// Par contre nous ne savons pas re-run nos effects automatiquement