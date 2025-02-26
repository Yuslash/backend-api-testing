import FriendRequest from '../../models/FriendRequest.js'

const sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body
        const senderId = req.session.user.id

        if (senderId === receiverId) return res.status(400).json({ success: false, message: "Cannot send request to yourself" })

        const exists = await FriendRequest.findOne({ sender: senderId, receiver: receiverId })
        if (exists) return res.status(400).json({ success: false, message: "Request already sent" })

        await FriendRequest.create({ sender: senderId, receiver: receiverId })
        res.json({ success: true, message: "Friend request sent" })
    } catch {
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export default sendFriendRequest
