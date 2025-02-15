import { useEffect, useState } from "react"

export default function AddProduct({apiPath,panelTitle}) {
  
    const [productData, setProductData] = useState([])
    const [cart, setCart] = useState([])
    // const [ cartUpdated, setCartUpdated ] = useState(false)

    const cartId = 'cart_01JM4F95CGDXY1BEH45NYB8ABM'

    const fetchCart = async () => {

      const response = await fetch(`http://localhost:3000/api/carts/${cartId}`)
      const data = await response.json()

      const items = data.cart?.cart?.items || []
      const sortedItems = [...items].sort((a, b) => a.id.localeCompare(b.id))

      setCart(sortedItems)

    }


    // lets write some logic to get the cart data without retrive the data each time manualy
    useEffect(() => {
      fetchCart()
    }, [])
    
 
    useEffect(() => {

      const fetchProductDetail = async () => {

          const response = await fetch(`http://localhost:3000${apiPath}`)

          const data =  await response.json()
          
          setProductData(data.products)
      }

      fetchProductDetail()

    }, [apiPath])


      const addToCart = async (variantId) => {

            await fetch(`http://localhost:3000/api/carts/${cartId}/line-items`, {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ variant_id: variantId, quantity: 1 })
            })
            
            await fetchCart()
      }

      //remove products from the cart
      const removeFromCart = async (lineId) => {
        
        await fetch(`http://localhost:3000/api/carts/${cartId}/line-items/${lineId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })

        await fetchCart()

      }

      //increase decrease the quantity
      const updateQuantity = async (lineId, newQuantity) => {

        if (newQuantity === 0 ) {
          await removeFromCart(lineId)
          return
        } // Prevent setting quantity to 0
    
        const response = await fetch(`http://localhost:3000/api/carts/${cartId}/line-items/${lineId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: newQuantity })
        })

        const data = await response.json();
        console.log("Updated cart:", data.cart)

        await fetchCart()
        
      }
    


  return (
    <>
      <div className="cateogory-panel mt-4 px-6 py-3 bg-indigo-500 text-white inline-flex shadow-md rounded-r-sm justify-start font-semibold">{panelTitle}</div>

      <div className="subscription-panel flex max-sm:flex-wrap max-lg:justify-center justify-start">

        {productData.length === 0 ? <p>Loading data</p> : productData.map((product) => (
          <div key={product.id} className="shop-cards bg-indigo-900 border border-indigo-100 mt-4 mx-6 flex p-4 gap-4 shadow-md rounded-md w-xs h-32 max-xs:flex-grow">
            <img className="bg-black min-w-24 min-h-24 object-cover p-4 rounded-md shadow-md" src={product.thumbnail ||"/vite.svg"} />
            <div className="flex flex-col justify-evenly items-center  w-full">
                <h1 className="font-semibold text-white text-md">{product.title}</h1>
                <button onClick={() => addToCart(product.variants[0].id)} className="text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 cursor-pointer px-4 py-2 rounded-md shadow-md">Add to Cart</button>
            </div> 
        </div>
        ))}

      </div>

{/* CART SECTION */}
      <div className='cart-container my-4 mx-6 rounded-md shadow-md bg-slate-50 flex justify-between items-center p-8 flex-col'>
                <h1 className='text-2xl font-semibold text-center'>This is Cart Section</h1>
                <div className='cart-section w-full min-h-24 bg-slate-100 rounded-md mt-4 flex flex-col p-4 justify-between items-center text-center'>
                
                
                    {!cart || cart.length === 0 ? (<p className='text-lg font-medium text-slate-300'>Cart is Empty</p>) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex justify-between w-full mb-4 items-center">
                          <h1>{item.product_title}</h1>
                          <div className="flex flex-col ">
                              <div className="flex gap-3 items-center">
                                <p>Total Price: {item.quantity * item.unit_price}</p>
                                <button onClick={() => removeFromCart(item.id)} className="bg-red-500 py-1 px-3  rounded-md text-white cursor-pointer hover:bg-red-600">Remove</button>
                              </div>

                              <div className="flex justify-between items-center mt-3">
                                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className=" bg-red-300 px-2 rounded-md cursor-pointer hover:bg-red-400">-</button>
                                  <span>{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className=" bg-green-300 px-2 rounded-md cursor-pointer hover:bg-green-400">+</button>
                              </div>

                          </div>
                        </div>
                      ))
                    )}
                
                
                </div>
            </div>

    </>
  )
}