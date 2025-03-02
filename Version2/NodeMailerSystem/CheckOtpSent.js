import OTP from "../../models/OtpModel.js";

const checkOtpSent = async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) return res.status(404).json({ success: false, message: "No OTP found for this email" });

    if (otpRecord.expiresAt < new Date()) {
        await OTP.deleteOne({ email });
        return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    res.json({ success: true, exists: true, message: "OTP found and is valid", expiresAt: otpRecord.expiresAt, lastRequested: otpRecord.lastRequested });
};

export default checkOtpSent;
