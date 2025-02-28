import TeamJoinRequest from "../../models/TeamJoinRequest.js"

const cancelJoinRequest = async (req, res) => {
    try {
        const { requestId } = req.body
        const userId = req.session.user.id

        const request = await TeamJoinRequest.findOne({ _id: requestId, userId })
        if (!request) return res.status(404).json({ success: false, message: 'Join request not found' })

        await TeamJoinRequest.deleteOne({ _id: requestId })

        res.json({ success: true, message: 'Join request canceled' })
    } catch {
        res.status(500).json({ success: false, message: 'Server Error' })
    }
}

export default cancelJoinRequest
