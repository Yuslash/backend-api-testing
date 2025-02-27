import Team from '../../models/team.js'

const getTeamDetails = async (req, res) => {
    try {
        const { teamName } = req.params
        const team = await Team.findOne({ teamName }).populate('members.userId', 'username')

        if (!team) return res.status(404).json({ success: false, message: 'Team not found' })

        res.json({ success: true, teamId: team._id, team })
    } catch {
        res.status(500).json({ success: false, message: 'Server Error' })
    }
}

export default getTeamDetails
