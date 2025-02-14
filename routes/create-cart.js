import express from 'express'
import fetch from 'node-fetch'

const createCart = ({ API_KEY, MEDUSA_BACKEND_URL }) => {
  const router = express.Router()

  router.post('/carts', async (req, res) => {
    const { region_id, variant_id } = req.body

    const cartData = {
      region_id: region_id || 'default-region-id',
      items: [
        {
          variant_id: variant_id || 'default-variant-id',
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
    res.json(data)
  })

  return router
}

export default createCart
