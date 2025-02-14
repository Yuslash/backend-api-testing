import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import cors from 'cors'
import { sequelize } from './productmodel.js'
import Product from './productmodel.js'
import Medusa from "@medusajs/medusa-js"
import getProduct from './Container/get-product.js'
import { Router } from 'express'


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


  //Medusa Container service
  router.get('/products', getProduct)

  app.use(router)

  const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND



app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
