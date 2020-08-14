let product = { price: 5, quantity: 2 }

let proxieProduct = new Proxy(product2, {
  get(t, k, r) {
    console.log('Get was call with key: ' + k)
    return Reflect.get(t, k, r)
  },
  set(t, k, v, r) {
    console.log('Set was called with key = ' + k + ' and value ' + v)
    return Reflect.set(t, k, v, r)
  }
})
proxieProduct.quantity = 4
console.log(proxieProduct.quantity)
