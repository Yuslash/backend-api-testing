import OTP from "../../models/OtpModel.js";

const getRemainingCooldown = async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) return res.json({ success: false, message: "Email is required" });
  
      const existingOtp = await OTP.findOne({ email });
      if (!existingOtp || !existingOtp.lastRequested) {
        return res.json({ success: true, remainingCooldown: 0 });
      }
  
      const now = Date.now();
      const timeDiff = now - new Date(existingOtp.lastRequested).getTime();
      const remainingCooldown = Math.max(0, Math.ceil((30000 - timeDiff) / 1000));
  
      return res.json({ success: true, remainingCooldown });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  export default getRemainingCooldown