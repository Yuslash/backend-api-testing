import FriendRequest from "../../models/FriendRequest.js"

const cancelFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body
        const userId = req.session.user.id

        const request = await FriendRequest.findById(requestId)
        if (!request) return res.status(404).json({ success: false, message: "Request not found" })
        if (request.sender.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized" })

        await FriendRequest.findByIdAndDelete(requestId)
        res.json({ success: true, message: "Friend request canceled" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export default cancelFriendRequest
