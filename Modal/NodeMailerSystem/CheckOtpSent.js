import OTP from "../../models/OtpModel.js";

const checkOtpSent = async (req, res) => {
    try {
        const { email } = req.query;

        // Validate email input
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Find the OTP record for the given email
        const otpRecord = await OTP.findOne({ email });

        // If no OTP record is found
        if (!otpRecord) {
            return res.status(404).json({ success: false, message: "No OTP found for this email" });
        }

        // Check if the OTP has expired
        const currentTime = new Date();
        if (otpRecord.expiresAt < currentTime) {
            // Delete the expired OTP record
            await OTP.deleteOne({ email });
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        // If OTP exists and is valid
        return res.json({ 
            success: true, 
            exists: true, 
            message: "OTP found and is valid", 
            expiresAt: otpRecord.expiresAt,
            lastRequested: otpRecord.lastRequested 
        });
    } catch (error) {
        console.error("Error checking OTP:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export default checkOtpSent;