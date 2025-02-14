import { Sequelize, DataTypes } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

// Set up Sequelize with your PostgreSQL database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
})

// Define the Product model
const Product = sequelize.define('Product', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency_code: {
    type: DataTypes.STRING,
    defaultValue: 'USD',  // Default to USD
  },
}, {
  timestamps: true,  // Add createdAt and updatedAt
})

export default Product
export { sequelize }
