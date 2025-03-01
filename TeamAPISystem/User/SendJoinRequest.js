import Team from "../../../models/team.js";
import TeamJoinRequest from "../../../models/TeamJoinRequest.js";
import User from "../../../models/user.js"; 

const sendJoinRequest = async (req, res) => {
    try {
        const { teamName } = req.params
        const userId = req.session.user.id

        const team = await Team.findOne({ teamName })
        if (!team) return res.status(404).json({ success: false, message: 'Team not found' })

        if (team.members.length >= 4) return res.status(400).json({ success: false, message: 'Team is full' })

        const existingRequest = await TeamJoinRequest.findOne({ userId, teamId: team._id })
        if (existingRequest) return res.status(400).json({ success: false, message: 'Request already sent' })

        
        const user = await User.findById(userId).select('username')
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

       
        const newRequest = await TeamJoinRequest.create({ 
            userId, 
            username: user.username, 
            teamId: team._id, 
            status: 'pending' 
        })

        res.json({ success: true, message: 'Join request sent', requestId: newRequest._id })
    } catch {
        res.status(500).json({ success: false, message: 'Server Error' })
    }
}

export default sendJoinRequest
