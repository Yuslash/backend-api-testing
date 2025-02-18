import express from 'express'
import fetch from 'node-fetch'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const router = express.Router()

const key_id = process.env.KEY_ID
const key_secret = process.env.KEY_SECRET
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND
const API_KEY = process.env.API_KEY

const razorpay = new Razorpay({ key_id, key_secret })

//  Step 1: Create Razorpay Order
router.post('/create-order', async (req, res) => {
    const { cart_id } = req.body

    if (!cart_id) return res.status(400).json({ error: 'Cart ID is required' })

    // Fetch the cart from Medusa
    const cartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cart_id}`, {
        method: 'GET',
        headers: { 'x-publishable-api-key': API_KEY }
    })
    const cartData = await cartResponse.json()

    if (!cartResponse.ok || !cartData.cart) {
        return res.status(400).json({ error: 'Cart not found' })
    }

    // Calculate total price
    const totalPrice = cartData.cart.items.reduce(
        (total, item) => total + item.quantity * item.unit_price,
        0
    )

    // Create Razorpay Order
    const options = {
        amount: totalPrice * 100, // Razorpay accepts paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
    }

    try {
        const order = await razorpay.orders.create(options)
        res.json({ order, cart: cartData.cart })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create Razorpay order' })
    }
})

//  Step 2: Verify Razorpay Payment
router.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart_id } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !cart_id) {
        return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Generate the signature for verification
    const generated_signature = crypto
        .createHmac('sha256', key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

    if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid payment signature' })
    }

    // Step 3: Create Order in Medusa
    try {
        const orderResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_id })
        })

        const orderData = await orderResponse.json()

        if (!orderResponse.ok) {
            return res.status(500).json({ error: 'Failed to create order in Medusa' })
        }

        res.json({ success: true, order: orderData.order })
    } catch (error) {
        res.status(500).json({ error: 'Error while creating order' })
    }
})

export default router
