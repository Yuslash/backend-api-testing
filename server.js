import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import cors from 'cors'
import { sequelize } from './productmodel.js'
import Product from './productmodel.js'
import Medusa from "@medusajs/medusa-js"
import { Router } from 'express'
import productRoutes from './Container/get-product.js'
import getCart from './routes/get-cart.js'
import createCart from './routes/create-cart.js'
import updateLineItem from './routes/update-line-items.js'
import deleteLineItem from './routes/delete-line.items.js'
import updateLineQuantity from './routes/update-line-items-quantity.js'
import Razorpay from 'razorpay'


dotenv.config()

const app = express()

sequelize.sync({ force: false })  // 'force: false' ensures it doesn't drop the table if it exists
  .then(() => {
    console.log('Database synced!')
  })
  .catch((err) => {
    console.error('Error syncing database:', err)
  })

app.use(express.json())
app.use(cors())
const API_KEY = process.env.API_KEY
const router = Router()

app.get('/api/products', async (req, res) => {

    const response = await fetch('http://localhost:9000/store/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': API_KEY
      }
    })

    const data = await response.json()
    res.json(data)
})

app.post('/api/products', async (req, res) => {
    const { title, description, price, currency_code } = req.body
  
    try {
      // Create a new product in the database
      const product = await Product.create({
        title,
        description,
        price,
        currency_code,
      })
  
      res.status(201).json(product)  // Return the created product
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

    const key_id = process.env.KEY_ID
    const key_secret = process.env.KEY_SECRET    

    // rezor integration
    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret
    }) 

    app.post('/create-order', async (req, res) => {

      const { cart } = req.body

      if(!cart || cart.length === 0) {
        return res.status(400).json({ error: 'cart is empty' })
      }

      const totalPrice = cart.reduce(
        (total, item) => total + item.quantity * item.unit_price,
        0
      )

      const options = {

        amount: totalPrice * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          key1: "value3",
          key2: "value2"
        }

      }

      const order =  await razorpay.orders.create(options)
      res.json(order)

    })


  //Medusa Container service

  app.use(router)

  const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND

  app.use('/api', productRoutes({ API_KEY, MEDUSA_BACKEND_URL }))
  app.use('/api', getCart({API_KEY, MEDUSA_BACKEND_URL}))
  app.use('/api', createCart({API_KEY, MEDUSA_BACKEND_URL}))
  app.use('/api', updateLineItem({API_KEY, MEDUSA_BACKEND_URL}))
  app.use('/api', deleteLineItem({API_KEY, MEDUSA_BACKEND_URL}))
  app.use('/api', updateLineQuantity({API_KEY, MEDUSA_BACKEND_URL}))


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
