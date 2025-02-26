import User from "../../models/user.js"
import mongoose from "mongoose"

const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body
        const userId = req.session.user.id

        if (!mongoose.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" })
        }

        const friendObjectId = new mongoose.Types.ObjectId(friendId)
        const userObjectId = new mongoose.Types.ObjectId(userId)

        await User.findByIdAndUpdate(userObjectId, { 
            $pull: { userFriends: { userId: friendObjectId } } 
        })

        await User.findByIdAndUpdate(friendObjectId, { 
            $pull: { userFriends: { userId: userObjectId } } 
        })

        res.json({ success: true, message: "Friend removed" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export default removeFriend
