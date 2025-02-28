import Team from "../../models/team.js"

const removeMember = async (req, res) => {
    try {
        const { teamId, memberId } = req.body
        const leaderId = req.session.user?.id

        const team = await Team.findById(teamId)
        if (!team) return res.status(404).json({ success: false, message: "Team not found" })

        const isLeader = team.members.some(m => m.userId.toString() === leaderId && m.role === "Leader")
        if (!isLeader) return res.status(403).json({ success: false, message: "You are not the leader" })

        const memberIndex = team.members.findIndex(m => m.userId.toString() === memberId)
        if (memberIndex === -1) return res.status(404).json({ success: false, message: "Member not found" })

        if (team.members[memberIndex].role === "Leader") return res.status(400).json({ success: false, message: "Leader cannot remove themselves" })

        team.members.splice(memberIndex, 1)
        await team.save()

        res.json({ success: true, message: "Member removed" })
    } catch {
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export default removeMember
