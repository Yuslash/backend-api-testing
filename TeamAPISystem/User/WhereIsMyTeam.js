import Team from "../../../models/team.js"
import User from "../../../models/user.js"

const getMyTeam = async (req, res) => {
    try {
        const { username } = req.params

        if (!username) return res.json({ success: false, message: "Username is required" })

        const user = await User.findOne({ username })

        if (!user) return res.json({ success: false, message: "User not found" })

        const team = await Team.findOne({ "members.userId": user._id })

        if (!team) return res.json({ success: false, message: "Team not found" })

        res.json({ success: true, team })
    } catch (error) {
        console.error("Error fetching team:", error)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export default getMyTeam
