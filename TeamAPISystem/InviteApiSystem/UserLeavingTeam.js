import Team from "../../../models/team.js"

const leaveTeam = async (req, res) => {
    try {
        const { newLeaderId } = req.body
        const userId = req.session.user?.id

        const team = await Team.findOne({ "members.userId": userId })
        if (!team) return res.json({ success: false, message: "You are not in a team" })

        const memberIndex = team.members.findIndex(m => m.userId.toString() === userId)
        if (memberIndex === -1) return res.json({ success: false, message: "User not found in team" })

        const isLeader = team.members[memberIndex].role === "Leader"
        team.members.splice(memberIndex, 1)

        if (isLeader) {
            if (team.members.length === 0) {
                await Team.deleteOne({ _id: team._id })
                return res.json({ success: true, message: "Team disbanded" })
            }

            const newLeaderIndex = team.members.findIndex(m => m.userId.toString() === newLeaderId)
            if (newLeaderIndex === -1) return res.json({ success: false, message: "New leader not found in team" })

            team.members[newLeaderIndex].role = "Leader"
        }

        await team.save()
        res.json({ success: true, message: isLeader ? "You have left, and a new leader has been assigned" : "You have left the team" })
    } catch {
        res.json({ success: false, message: "Server Error" })
    }
}

export default leaveTeam
