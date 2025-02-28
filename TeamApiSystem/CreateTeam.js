import Team from "../../models/team.js";
import User from "../../models/user.js"; // Import the User model

const createTeam = async (req, res) => {
    try {
        const { teamName } = req.body
        const leaderId = req.session.user.id

        // Find the leader's username
        const leader = await User.findById(leaderId).select('username')
        if (!leader) return res.status(404).json({ success: false, message: "User not found" })

        // Check if the user already has a team
        const existingTeam = await Team.findOne({ 'members.userId': leaderId })
        if (existingTeam) return res.status(400).json({ success: false, message: "You already have a team" })

        // Create a new team with leader's username
        const newTeam = await Team.create({
            teamName,
            members: [{ userId: leaderId, username: leader.username, role: 'Leader' }]
        })

        res.json({ success: true, message: "Team Created Successfully", teamId: newTeam._id })

    } catch {
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export default createTeam;
