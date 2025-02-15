import { useState } from "react"
import { useEffect } from "react"

export default function Product() {

  const [ products, setProducts ] = useState([])

  useEffect(() => {

    const fetchProductDetail = async () => {

      const response = await fetch('http://localhost:3000/api/products')
      const data = await response.json()
      console.log(data.products);
      
      setProducts(data.products)

    }

    fetchProductDetail()

  },  [])

  return (
    
    <div>
      {products.map((product) => (
          <div key={product.id}>
            <span>{product.title}</span>
          </div> 
      ))}
    </div>

    )

}