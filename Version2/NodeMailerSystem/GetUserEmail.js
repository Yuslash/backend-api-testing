import User from "../../models/user.js";

const getUserEmail = async (req, res) => {
    try {
      const user = await User.findById(req.session.user.id).select('email');
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      res.json({ email: user.email });
    } catch (err) {
      res.status(500).json({ message: 'Please login to get details' });
    }
  };
  
  export default getUserEmail;