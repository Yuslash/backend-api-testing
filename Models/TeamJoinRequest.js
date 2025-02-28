import mongoose from 'mongoose'
import Team from './team.js'

const teamJoinRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    username: { type: String, required: true }, // Add this field
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected'] },
    createdAt: { type: Date, default: Date.now }
})


const TeamJoinRequest = mongoose.model('TeamJoinRequest', teamJoinRequestSchema)

export default TeamJoinRequest
