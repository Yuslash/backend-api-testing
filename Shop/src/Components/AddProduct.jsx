import React, { useEffect, useState } from "react"

export default function AddProduct({ apiPath, panelTitle, addToCart }) {
  const [productData, setProductData] = useState([])

  useEffect(() => {
    const fetchProductDetail = async () => {
      const response = await fetch(`http://localhost:3000${apiPath}`)
      const data = await response.json()

      //filter the products data by the collection name
      const filterProducts = data.products.filter((product) => {

        const collectionTitle = product.collection?.title

        return (
          collectionTitle && collectionTitle.toLowerCase() === panelTitle.toLowerCase()
        )

      })
      
      setProductData(filterProducts)
    }
    fetchProductDetail()
  }, [apiPath, panelTitle])

  return (
    <>
      <div className="cateogory-panel mt-4 px-6 py-3 bg-indigo-500 text-white inline-flex shadow-md rounded-r-sm justify-start font-semibold">
        {panelTitle}
      </div>

      <div className="subscription-panel flex max-xl:flex-wrap justify-center">
        {productData.length === 0 ? (
          <p>Loading data</p>
        ) : (
          productData.map((product) => (
            <div
              key={product.id}
              className="shop-cards bg-indigo-900 border border-indigo-100 mt-4 mx-6 flex max-xs:flex-col max-xs:h-auto p-4 gap-4 shadow-md rounded-md w-xs h-32 max-xs:flex-grow overflow-hidden"
            >
              <img
                className="bg-black min-w-24 min-h-24 object-cover p-4 rounded-md shadow-md"
                src={product.thumbnail || "/vite.svg"}
                alt={product.title}
              />
              <div className="flex flex-col justify-evenly items-center w-full">
                <h1 className="font-semibold text-white text-md text-center">
                  {product.title}
                </h1>
                <button
                  onClick={() => addToCart(product.variants[0].id)}
                  className="text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 cursor-pointer px-4 py-2 rounded-md shadow-md text-nowrap"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
