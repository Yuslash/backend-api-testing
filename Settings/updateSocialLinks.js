import User from "../../models/user.js";

const updateGitHub = async (req, res) => {
    const { github } = req.body;
    const userId = req.session.user?.id;

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false });

    user.github = github;
    await user.save();

    res.json({ success: true });
};

const updateInstagram = async (req, res) => {
    const { instagram } = req.body;
    const userId = req.session.user?.id;

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false });

    user.instagram = instagram;
    await user.save();

    res.json({ success: true });
};

const updatePortfolio = async (req, res) => {
    const { portfolio } = req.body;
    const userId = req.session.user?.id;

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false });

    user.portfolio = portfolio;
    await user.save();

    res.json({ success: true });
};

export { updateGitHub, updateInstagram, updatePortfolio };
