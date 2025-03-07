import Team from "../../../models/team.js"
import TeamJoinRequest from "../../../models/TeamJoinRequest.js"

const getTeamRequests = async (req, res) => {
    try {
        const { teamName } = req.params
        const leaderId = req.session.user.id

        // Find the team where the user is the leader
        const team = await Team.findOne({ teamName, 'members.userId': leaderId, 'members.role': 'Leader' })
        if (!team) return res.status(403).json({ success: false, message: 'You are not the leader of this team' })

        // Get all join requests for this team and populate the username
        const requests = await TeamJoinRequest.find({ teamId: team._id, status: 'pending' })
            .populate('userId', 'username')

        // Get team members with usernames
        const members = await Team.findOne({ _id: team._id }).populate('members.userId', 'username')

        res.json({ success: true, requests, members: members.members })

    } catch {
        res.status(500).json({ success: false, message: 'Server Error' })
    }
}

export default getTeamRequests
