import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    trim: true, 
    unique: true 
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      username: {
        type: String,
        required: true
      },
      role: {
        type: String,
        default: 'Member', 
        enum: ['Leader', 'Member']
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now 
  }
})

// Pre-save validation for leader and member count
teamSchema.pre('save', function (next) {
  if (this.members.length > 4) 
    return next(new Error('A team cannot have more than 4 members'))

  if (this.members.length > 0 && !this.members.some(member => member.role === 'Leader'))
    return next(new Error('A team must have a leader'))

  next()
})

const Team = mongoose.model('Team', teamSchema)

export default Team
