import express from 'express'
import fetch from 'node-fetch'

const updateLineItem = ({ API_KEY, MEDUSA_BACKEND_URL }) => {
  const router = express.Router()

  router.post('/carts/:cartId/line-items', async (req, res) => {
    const { cartId } = req.params
    const { variant_id, quantity } = req.body

    const lineItemData = {
      variant_id: variant_id || 'default-variant-id',
      quantity: quantity || 1
    }

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': API_KEY
      },
      body: JSON.stringify(lineItemData)
    })

    const data = await response.json()
    res.json(data)
  })

  return router
}

export default updateLineItem
