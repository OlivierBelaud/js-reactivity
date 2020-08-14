const targetMap = new WeakMap()
let activeEffect = null

let track = (target, key) => {
  console.log('activeEffect: ' + activeEffect)
  if(activeEffect) {
    console.log('track:' + key)
    let depsMap = targetMap.get(target)
    if(!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if(!dep){
      depsMap.set(key, (dep = new Set()))
    }
    dep.add(activeEffect)
  }
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

function effect(eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

let product = reactive({ price: 5, quantity: 2 })
let salePrice = 0
let total = 0

effect(() => {
  console.log('run effect 1')
  total = product.price * product.quantity
})
effect(() => {
  console.log('run effect 2')
  salePrice = product.price * 0.9
})

console.log(
  `Before updated quantity total (should be 10) = ${total} salePrice (should be 4.5) = ${salePrice}`
)
product.quantity = 3
console.log(
  `After updated quantity total (should be 15) = ${total} salePrice (should be 4.5) = ${salePrice}`
)
product.price = 10
console.log(
  `After updated price total (should be 30) = ${total} salePrice (should be 9) = ${salePrice}`
)
