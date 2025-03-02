import OTP from "../../models/OtpModel.js";
import User from "../../models/user.js";
import { sendOTP } from "./Mailer.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.json({ success: false, message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        if (user.emailVerified) return res.json({ success: false, message: "User already verified" });

        // Fetch last OTP request time from DB
        const existingOtp = await OTP.findOne({ email });
        const now = Date.now();

        if (existingOtp && existingOtp.lastRequested) {
            const timeDiff = now - new Date(existingOtp.lastRequested).getTime();
            if (timeDiff < 30000) {
                const remainingTime = Math.ceil((30000 - timeDiff) / 1000);
                return res.json({ success: false, message: `Wait ${remainingTime} seconds before requesting a new OTP` });
            }
        }

        const otp = generateOTP();
        const expiresAt = new Date(now + 5 * 60000); // 5 min expiry

        // Store OTP and update last request time
        await OTP.findOneAndUpdate(
            { email },
            { otp, expiresAt, lastRequested: now },
            { upsert: true, new: true }
        );

        await sendOTP(email, otp);

        return res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export default sendOtp;