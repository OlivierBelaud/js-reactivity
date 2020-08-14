const reactive = (t) => {
  const handler = {
    get(t, k, r) {
      console.log('Get was call with key: ' + k)
      return Reflect.get(t, k, r)
    },
    set(t, k, v, r) {
      console.log('Set was called with key = ' + k + ' and value ' + v)
      return Reflect.set(t, k, v, r)
    }
  }
  return new Proxy(t, handler)
}

let product = reactive({ price: 5, quantity: 2 })

product.quantity = 4
console.log(product.quantity)
