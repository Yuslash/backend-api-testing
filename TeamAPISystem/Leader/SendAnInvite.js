import Team from "../../models/team.js"
import User from "../../../models/user.js"
import LeaderInviteRequest from "../../../models/LeaderInviteRequest.js"

const sendTeamInvite = async (req, res) => {
    try {
        const { teamName, username } = req.body
        if (!teamName || !username) return res.json({ success: false, message: "Team name and username are required" })

        const team = await Team.findOne({ teamName })
        if (!team) return res.json({ success: false, message: "Team not found" })

        const leader = team.members.find(member => member.role === "Leader")
        if (!leader || leader.userId.toString() !== req.session.user.id) return res.json({ success: false, message: "You are not the team leader" })

        if (team.members.length >= 4) return res.json({ success: false, message: "Team is full" })

        const user = await User.findOne({ username })
        if (!user) return res.json({ success: false, message: "User not found" })

        // Prevent leader from inviting themselves
        if (leader.userId.equals(user._id)) return res.json({ success: false, message: "You cannot invite yourself" })

        // Check if user is already in a team
        const userInTeam = await Team.findOne({ "members.userId": user._id })
        if (userInTeam) return res.json({ success: false, message: "User is already in a team" })

        // Check if invite already exists
        const existingInvite = await LeaderInviteRequest.findOne({ teamId: team._id, userId: user._id })
        if (existingInvite) return res.json({ success: false, message: "Invite already sent" })

        // Store invite in LeaderInviteRequest
        const invite = await LeaderInviteRequest.create({
            teamId: team._id,
            leaderId: leader.userId,
            userId: user._id,
            username,
            status: "pending"
        })

        res.json({ success: true, message: "Invite sent successfully", inviteId: invite._id })
    } catch (error) {
        console.error("Error sending invite:", error)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export default sendTeamInvite
