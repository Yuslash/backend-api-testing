import User from "../../models/user.js"

const getFriendList = async (req, res) => {
    try {
        const userId = req.session.user.id

        const user = await User.findById(userId).populate("userFriends", "username imageUrl")

        if (!user) return res.status(404).json({ success: false, message: "User not found" })

        res.json({ success: true, friends: user.userFriends })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export default getFriendList
