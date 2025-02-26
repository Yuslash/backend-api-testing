import FriendRequest from "../../models/FriendRequest.js"
import User from "../../models/user.js"

const getIncomingRequests = async (req, res) => {
    try {
        const userId = req.session.user.id

        const requests = await FriendRequest.find({ receiver: userId })
            .populate({ path: "sender", model: User, select: "username imageUrl" })

        res.json({ success: true, requests })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export default getIncomingRequests
