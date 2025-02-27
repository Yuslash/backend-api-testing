import Team from "../../models/team.js";

const createTeam = async (req, res) => {

    try {

        const { teamName } = req.body
        const leaderId = req.session.user.id

        const existingTeam = await Team.findOne({ 'members.userId': leaderId })
        if (existingTeam) return res.status(400).json({ success: false, message: "You already have a team" })

        const newTeam = await Team.create({
            teamName,
            members: [{ userId: leaderId, role: 'Leader' }]
        })

        res.json({success: true, message: "Team Created Successfully", teamId: newTeam._id})

    } catch {
        res.status(500).json({ success: false, message: "Server Error" })
    }

} 

export default createTeam