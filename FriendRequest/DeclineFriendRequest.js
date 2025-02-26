import FriendRequest from "../../models/FriendRequest.js"

const declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body
        const userId = req.session.user.id

        const request = await FriendRequest.findById(requestId)
        if (!request) return res.status(404).json({ success: false, message: "Request not found" })
        if (request.receiver.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized" })

        await FriendRequest.findByIdAndDelete(requestId)
        res.json({ success: true, message: "Friend request declined" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export default declineFriendRequest
