import Team from "../../models/team.js";
import JoinRequest from "../../models/JoinRequest.js";

const sendJoinRequest = async (req, res) => {
    try {
        const { teamName } = req.body
        const userId = req.session.user.id

        const team = await Team.findOne({ teamName })
        if (!team) return res.status(404).json({ success: false, message: 'Team not found' })

        if (team.members.length >= 4) return res.status(400).json({ success: false, message: 'Team is full' })

        const existingRequest = await JoinRequest.findOne({ userId, teamId: team._id })
        if (existingRequest) return res.status(400).json({ success: false, message: 'Request already sent' })

        const newRequest = await JoinRequest.create({ userId, teamId: team._id, status: 'pending' })

        res.json({ success: true, message: 'Join request sent', requestId: newRequest._id })
    } catch {
        res.status(500).json({ success: false, message: 'Server Error' })
    }
}

export default sendJoinRequest