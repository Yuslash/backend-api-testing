import FriendRequest from "../../models/FriendRequest.js"

const getOutgoingRequests = async (req, res) => {
    try {
        const userId = req.session.user.id

        const requests = await FriendRequest.find({ sender: userId })
            .populate("receiver", "username imageUrl")

        res.json({ success: true, requests })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export default getOutgoingRequests
