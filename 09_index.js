const targetMap = new WeakMap()
let activeEffect = null

let track = (target, key) => {
  // console.log('activeEffect: ' + activeEffect)
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

function ref(raw) {
  const r = {
    get value() {
      console.log('Get Ref was call with value = ' + raw)
      track(r, 'value')
      return raw
    },
    set value(newVal) {
      console.log('Set Ref was call with value = ' + newVal)
      raw = newVal
      trigger(r, 'value')
      return raw
    }
  }
  return r
}

function effect(eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

let product = reactive({ price: 5, quantity: 2 })
let salePrice = ref(0)
let total = 0

console.log('salePrice',salePrice)
effect(() => {
  console.log('run effect 2')
  salePrice.value = product.price * 0.9
})
effect(() => {
  console.log('run effect 1')
  total = salePrice.value * product.quantity
})

console.log(
  `Before updated quantity total (should be 9) = ${total} salePrice (should be 4.5) = ${salePrice.value}`
)
product.quantity = 3
console.log(
  `After updated quantity total (should be 13.5) = ${total} salePrice (should be 4.5) = ${salePrice.value}`
)
product.price = 10
console.log(
  `After updated price total (should be 27) = ${total} salePrice (should be 9) = ${salePrice.value}`
)
