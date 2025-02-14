import express from 'express'
import fetch from 'node-fetch'

const createCart = ({ API_KEY, MEDUSA_BACKEND_URL }) => {
  const router = express.Router()

  router.post('/carts/create', async (req, res) => {

    const { variant_id } = req.body

    const cartData = {
      region_id: 'reg_01JM2716AFTAH2BKT5KMFRE2P4',  
      email: 'testuser@example.com',
      items: [
        {
          variant_id: variant_id,  
          quantity: 1
        }
      ]
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

    res.json({ cartId: data.id })
  })

  return router
}

export default createCart
