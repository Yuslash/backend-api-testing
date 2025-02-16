import express from 'express'
import fetch from 'node-fetch'

const createCart = ({ API_KEY, MEDUSA_BACKEND_URL }) => {
  const router = express.Router()

  router.post('/carts/create', async (req, res) => {

    const cartData = {
      region_id: 'reg_01JM2716AFTAH2BKT5KMFRE2P4',  
      email: 'alphatester@billionoillid.com',
    }

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': API_KEY
      },
      body: JSON.stringify(cartData)
    })

    const data = await response.json()

    console.log(data.cart.id);
    
    res.json({ cartId: data.cart.id })
  })

  return router
}

export default createCart
