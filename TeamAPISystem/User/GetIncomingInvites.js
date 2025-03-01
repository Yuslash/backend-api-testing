import LeaderInviteRequest from "../../../models/LeaderInviteRequest.js"

const getIncomingInvites = async (req, res) => {
    try {
        const userId = req.session.user?.id

        const invites = await LeaderInviteRequest.find({ userId, status: "pending" })
            .populate("teamId", "teamName") // Get team name
            .populate("leaderId", "username") // Get leader name

        res.json({ success: true, invites })
    } catch {
        res.json({ success: false, message: "Server Error" })
    }
}

export default getIncomingInvites
