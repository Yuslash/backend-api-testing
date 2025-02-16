import express from 'express'
import fetch from 'node-fetch'

const deleteLineItem = ({ API_KEY, MEDUSA_BACKEND_URL }) => {
  const router = express.Router()

  router.delete('/carts/:cartId/line-items/:lineId', async (req, res) => {
    const { cartId, lineId } = req.params

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineId}`, {
      method: 'DELETE',
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

export default deleteLineItem
