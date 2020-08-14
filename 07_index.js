const targetMap = new WeakMap()

let track = (target, key) => {
  console.log('track:' + key)
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
  console.log('trigger:' + key)
  let depsMap = targetMap.get(target)
  if(!depsMap) { return }
  let dep = depsMap.get(key)
  if(dep){
    dep.forEach(effect => {
      effect()
    })
  }
}

const reactive = (t) => {
  const handler = {
    get(t, k, r) {
      let result = Reflect.get(t, k, r)
      track(t, k)
      console.log('Get was call with key = ' + k)
      return result
    },
    set(t, k, v, r) {
      let oldV = t[k]
      let result = Reflect.set(t, k, v, r)
      if(result && oldV != v){
        trigger(t, k)
      }
      console.log('Set was called with key = ' + k + ' and value ' + v)
      return result
    }
  }
  return new Proxy(t, handler)
}

let product = reactive({ price: 5, quantity: 2 })
let total = 0
let total2 = 0

let effect = () => {
  total = product.price * product.quantity
}

console.log(`total is ${total}`)

effect()

console.log(`total is ${total}`)

product.quantity = 3

console.log(`total is ${total}`)
console.log(`product.quantity is ${product.quantity}`)
