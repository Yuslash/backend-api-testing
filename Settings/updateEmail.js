import User from "../../models/user.js";

const updateEmail = async (req, res) => {
    
    const { newEmail } = req.body;
    const userId = req.session.user?.id;

    if (!userId) return res.json({ success: false, message: "User not authenticated" });

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    user.email = newEmail;
    user.emailVerified = false;

    await user.save();
    console.log("User updated successfully:", user);  // Log updated user data
    return res.json({ success: true });

};

export default updateEmail