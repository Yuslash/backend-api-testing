import express from 'express';
import fetch from 'node-fetch';

const productRoutes = ({ API_KEY, MEDUSA_BACKEND_URL }) => {
  const router = express.Router();

  // Get products from Medusa
  router.get('/products', async (req, res) => {
    try {
      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default productRoutes;
