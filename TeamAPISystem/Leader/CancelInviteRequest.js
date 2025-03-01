import LeaderInviteRequest from "../../../models/LeaderInviteRequest.js";
import Team from "../../../models/team.js";

const cancelInviteRequest = async (req, res) => {
    try {
        const { inviteId } = req.body
        const leaderId = req.session.user?.id

        const invite = await LeaderInviteRequest.findById(inviteId)
        if (!invite) return res.json({ success: false, message: "Invite not found" })

        const team = await Team.findById(invite.teamId)
        if (!team) return res.json({ success: false, message: "Team not found" })

        const isLeader = team.members.some(m => m.userId.toString() === leaderId && m.role === "Leader")
        if (!isLeader) return res.json({ success: false, message: "You are not the leader of this team" })

        await LeaderInviteRequest.findByIdAndDelete(inviteId)
        res.json({ success: true, message: "Invite canceled" })
    } catch {
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export default cancelInviteRequest