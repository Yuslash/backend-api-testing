import React, { useEffect, useState } from "react"
import AddProduct from "./AddProduct"
import CartSection from "./CartSection"

export const Experience = () => {

  const [cart, setCart] = useState([])
  const cartId = "cart_01JM4F95CGDXY1BEH45NYB8ABM"

  const fetchCart = async () => {
    const response = await fetch(`http://localhost:3000/api/carts/${cartId}`)
    const data = await response.json()
    const items = data.cart?.cart?.items || []
    const sortedItems = [...items].sort((a, b) => a.id.localeCompare(b.id))
    setCart(sortedItems)
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const addToCart = async (variantId) => {
    await fetch(`http://localhost:3000/api/carts/${cartId}/line-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variant_id: variantId, quantity: 1 })
    })
    fetchCart()
  }

  const removeFromCart = async (lineId) => {
    await fetch(`http://localhost:3000/api/carts/${cartId}/line-items/${lineId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
    fetchCart()
  }

  const updateQuantity = async (lineId, newQuantity) => {
    if (newQuantity === 0) {
      await removeFromCart(lineId)
      return
    }
    await fetch(`http://localhost:3000/api/carts/${cartId}/line-items/${lineId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity })
    })
    fetchCart()
  }

  const totalPrice = cart.reduce(
    (total, item) => total + item.quantity * item.unit_price,
    0
  )

  return (
    <div>

      <AddProduct 
        apiPath={"/api/products"} 
        panelTitle={"Subscriptions"}
        addToCart={addToCart} 
      />

      <AddProduct 
        apiPath={"/api/products"} 
        panelTitle={"Physical Items"}
        addToCart={addToCart} 
      />

      <AddProduct 
        apiPath={"/api/products"} 
        panelTitle={"Claim"}
        addToCart={addToCart} 
      />

      <CartSection 
        cart={cart} 
        totalPrice={totalPrice} 
        removeFromCart={removeFromCart} 
        updateQuantity={updateQuantity} 
      />
    </div>
  )
}
