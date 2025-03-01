import LeaderInviteRequest from "../../../models/LeaderInviteRequest.js"
import Team from "../../../models/team.js"

const acceptTeamInvite = async (req, res) => {
    try {
        const { inviteId } = req.body
        const userId = req.session.user?.id

        const invite = await LeaderInviteRequest.findById(inviteId)
        if (!invite) return res.json({ success: false, message: "Invite not found" })

        if (invite.userId.toString() !== userId) return res.json({ success: false, message: "You are not allowed to accept this invite" })

        const team = await Team.findById(invite.teamId)
        if (!team) return res.json({ success: false, message: "Team does not exist" })

        if (team.members.length >= 4) return res.json({ success: false, message: "Team is full" })

        team.members.push({ userId, username: invite.username, role: "Member" })
        await team.save()

        await invite.deleteOne() 

        res.json({ success: true, message: "You have joined the team" })
    } catch {
        res.json({ success: false, message: "Server Error" })
    }
}

export default acceptTeamInvite
