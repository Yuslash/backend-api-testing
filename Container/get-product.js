import { ProductService } from '@medusajs/medusa-js'

export default async (req, res) => {


    const container = req.scope
    const productService = container.resolve('productService')
  
    try {
      const product = await productService.retrieve(pcol_01JM0BY5XZE59X0YX1QHB58FTR);
      res.json({ product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  