import crypto from "crypto";
import OTP from "../../models/OtpModel.js";
import User from "../../models/user.js";

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "OTP expired or invalid" });
        }

        // Ensure expiry check is done correctly
        if (new Date(otpRecord.expiresAt) < new Date()) {
            await OTP.deleteOne({ email });
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        // Secure OTP comparison
        if (!crypto.timingSafeEqual(Buffer.from(otpRecord.otp), Buffer.from(otp))) {
            return res.status(400).json({ success: false, message: "Incorrect OTP" });
        }

        // Delete OTP after successful verification
        await OTP.deleteOne({ email });

        // Update user email verification status
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { emailVerified: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, message: "OTP verified, email marked as verified" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export default verifyOtp;
