import User from "../../models/user.js";
import argon2 from "argon2";

const updatePassword = async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.session.user?.id;

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false });

    user.password = await argon2.hash(newPassword);
    await user.save();

    res.json({ success: true });
};

export default updatePassword;
