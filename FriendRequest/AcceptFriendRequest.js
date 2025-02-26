import FriendRequest from "../../models/FriendRequest.js"
import User from "../../models/user.js"
import mongoose from "mongoose"

const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body
        const userId = req.session.user.id 

        if (!mongoose.modelNames().includes("user")) {
            return res.status(500).json({ success: false, message: "User model not registered" })
        }

        const request = await FriendRequest.findById(requestId).populate("sender", "username")
        if (!request) return res.status(404).json({ success: false, message: "Request not found" })

        if (request.receiver.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" })
        }

        const senderId = new mongoose.Types.ObjectId(request.sender._id)
        const senderUsername = request.sender.username
        const receiverId = new mongoose.Types.ObjectId(userId)

        await User.findByIdAndUpdate(receiverId, { 
            $push: { userFriends: { userId: senderId, username: senderUsername } }
        })

        const receiver = await User.findById(userId, "username")
        await User.findByIdAndUpdate(senderId, { 
            $push: { userFriends: { userId: receiverId, username: receiver.username } }
        })

        await FriendRequest.findByIdAndDelete(requestId)

        res.json({ success: true, message: "Friend request accepted" })
    } catch (error) {
        console.error("Error accepting friend request:", error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export default acceptFriendRequest
