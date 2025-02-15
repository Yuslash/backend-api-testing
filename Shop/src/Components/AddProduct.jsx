import { useEffect, useState } from "react"

export default function AddProduct({apiPath,panelTitle}) {
  
    const [productData, setProductData] = useState([])
    const [cart, setCart] = useState(null)
    const [ isCartEmpty, setIsCartEmpty ] = useState(true)
    const [ cartId, setCartId ] = useState(localStorage.getItem('cartId') || null)

    useEffect(() => {

      if(cartId) {
        localStorage.setItem('cartId', cartId)
      }

    }, [cartId])
 
    useEffect(() => {

      const fetchProductDetail = async () => {

          const response = await fetch(`http://localhost:3000${apiPath}`)

          const data =  await response.json()
          
          setProductData(data.products)
      }

      fetchProductDetail()

    }, [])


      const addToCart = async (variantId) => {

        if(!cartId) {
          const response = await fetch(`http://localhost:3000/api/carts/create`, {
            method: "POST",
            headers: {
              "Content-Type" : "application/json"
            },
            body: JSON.stringify({variant_id : variantId})
          })
  
          const data = await response.json()
  
          setCartId(data.cartId)
          console.log(data.cartId);
          

        } else {

          const response = await fetch(`http://localhost:3000/api/carts/${cartId}/line-items`, {

            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ variant_id: variantId, quantity: 1 })

          })

          const data = await response.json()
          console.log(`item added to cart`, data);
          

        }

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
                <div className='cart-section w-full min-h-24 bg-slate-100 rounded-md mt-4 flex p-4 justify-center items-center'>
                
                
                    {isCartEmpty ? (<p className='text-lg font-medium text-slate-300'>Cart is Empty</p>) : <p>Yeah products available</p>}
                
                
                </div>
            </div>

    </>
  )
}