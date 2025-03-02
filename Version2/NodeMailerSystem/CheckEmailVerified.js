import User from "../../models/user.js";

const checkEmailVerification = async (req, res) => {
  try {
    console.log("Session Data:", req.session);

    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(req.session.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: user.emailVerified }); // true or false
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default checkEmailVerification;
