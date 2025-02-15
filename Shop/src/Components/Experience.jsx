import React, { useEffect } from 'react'
import AddProduct from './AddProduct'

export const Experience = () => {

  return (
    <div>
        <AddProduct apiPath={'/api/products'} panelTitle={"Subscription"} />
            
    </div>
  )
}
