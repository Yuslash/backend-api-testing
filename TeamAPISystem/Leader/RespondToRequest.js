import TeamJoinRequest from "../../../models/TeamJoinRequest.js"

const acceptJoinRequest = async (req, res) => {
    try {
        const { requestId } = req.body
        const leaderId = req.session.user?.id
        if (!leaderId) return res.status(401).json({ success: false, message: "Unauthorized" })

        const joinRequest = await TeamJoinRequest.findById(requestId).populate("teamId")
        if (!joinRequest) return res.status(404).json({ success: false, message: "Join request not found" })

        const team = joinRequest.teamId
        if (!team) return res.status(404).json({ success: false, message: "Team not found for this request" })

        if (!team.members?.some(member => member.userId.toString() === leaderId && member.role === "Leader")) {
            return res.status(403).json({ success: false, message: "You are not the leader of this team" })
        }

        if (team.members.length >= 4) return res.status(400).json({ success: false, message: "Team is full" })

        team.members.push({ userId: joinRequest.userId, username: joinRequest.username, role: "Member" })
        await team.save()
        await TeamJoinRequest.findByIdAndDelete(requestId)

        res.json({ success: true, message: "Join request accepted" })
    } catch {
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

const rejectJoinRequest = async (req, res) => {
    try {
        const { requestId } = req.body
        const leaderId = req.session.user?.id
        if (!leaderId) return res.status(401).json({ success: false, message: "Unauthorized" })

        const joinRequest = await TeamJoinRequest.findById(requestId).populate("teamId")
        if (!joinRequest) return res.status(404).json({ success: false, message: "Join request not found" })

        const team = joinRequest.teamId
        if (!team) return res.status(404).json({ success: false, message: "Team not found for this request" })

        if (!team.members.some(member => member.userId.toString() === leaderId && member.role === "Leader")) {
            return res.status(403).json({ success: false, message: "You are not the leader of this team" })
        }

        await TeamJoinRequest.findByIdAndDelete(requestId)
        res.json({ success: true, message: "Join request rejected" })
    } catch {
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export { acceptJoinRequest, rejectJoinRequest }
