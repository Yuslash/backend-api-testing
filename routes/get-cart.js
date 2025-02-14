import express from 'express'
import fetch from 'node-fetch'

const getCart = ({ API_KEY, MEDUSA_BACKEND_URL }) => {
  const router = express.Router()

  router.get('/carts/:cartId', async (req, res) => {
    
    const { cartId } = req.params

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': API_KEY
      }
    })

    const data = await response.json()
    res.json({ cart: data })
  })

  return router
}

export default getCart
