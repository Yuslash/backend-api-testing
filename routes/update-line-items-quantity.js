import express from 'express';
import fetch from 'node-fetch';

const updateLineQuantity = ({ API_KEY, MEDUSA_BACKEND_URL }) => {
    const router = express.Router();

    router.post('/carts/:cartId/line-items/:lineId', async (req, res) => {
        const { cartId, lineId } = req.params;
        const { quantity } = req.body;

        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-publishable-api-key": API_KEY },
            body: JSON.stringify({ quantity })
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to update item quantity" });
        }

        const data = await response.json();
        res.json({ cart: data });
    });

    return router;
};

export default updateLineQuantity; // ✅ Make sure this is exported
