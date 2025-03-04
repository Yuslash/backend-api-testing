import User from "../../models/user.js";

const updateCountry = async (req, res) => {
    const { country } = req.body;
    const userId = req.session.user?.id;

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false });

    user.country = country;
    await user.save();

    res.json({ success: true });
};

export default updateCountry;
