import User from "../../models/user.js";

const updateAdditionalEmail = async (req, res) => {
    const { additionalEmail } = req.body;
    const userId = req.session.user?.id;

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false });

    user.additionalEmail = additionalEmail;
    await user.save();

    res.json({ success: true });
};

export default updateAdditionalEmail;
