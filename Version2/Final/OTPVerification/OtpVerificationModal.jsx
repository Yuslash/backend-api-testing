import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import server from "../../host";

const url = `http://${server.host}:${server.port}`;

const OtpVerificationModal = ({ isOpen, onClose, email, verifyOtp }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [message, setMessage] = useState({ text: "", color: "text-red-500" });
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) return;

    const fetchCooldown = async () => {
      const response = await axios.get(`${url}/auth/get-otp-cooldown`, {
        params: { email },
      });
      setResendTimer(response.data.cooldown);
    };

    fetchCooldown();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (otp.some((digit) => digit === "")) {
        setMessage({ text: "⚠️ Please enter all 6 digits.", color: "text-yellow-500" });
        return;
    }

    setLoading(true);
    let result = { success: false, message: "Something went wrong" };

    try {
        result = await verifyOtp(otp.join(""));
    } finally {
        setLoading(false);
    }

    setMessage({ text: result.message, color: result.success ? "text-green-500" : "text-red-500" });
};


  const handleResendOtp = async () => {
    if (resending) return;
    setResending(true);

    const response = await axios.post(`${url}/auth/send-otp`, { email });

    setResending(false);
    if (response.data.success) {
      setResendTimer(30);
      setMessage({ text: "OTP Resent Successfully.", color: "text-green-500" });
    } else {
      setMessage({ text: response.data.message, color: "text-red-500" });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length !== 6 || isNaN(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);

    newOtp.forEach((value, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = value;
      }
    });

    inputRefs.current[5]?.focus();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed bottom-4 right-4 z-[999] p-6 bg-gray-800 border border-gray-600 rounded-2xl shadow-xl w-[90%] max-w-md text-center text-gray-300 font-mono"
    >
      <h2 className="text-2xl font-semibold text-gray-400">🔐 Enter OTP</h2>
      <p className="mt-2 text-gray-300">A 6-digit code has been sent to <span className="text-green-300 ">{email}</span></p>
      <div className="mt-5 flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-xl border border-gray-600 bg-gray-700 text-gray-300 rounded-md"
          />
        ))}
      </div>
      {message.text && <p className={`mt-3 ${message.color}`}>{message.text}</p>}
      <div className="mt-5 flex justify-between">
        <button
          disabled={resendTimer > 0 || resending}
          onClick={handleResendOtp}
          className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-500 shadow-md flex items-center justify-center w-36 disabled:opacity-50"
        >
          {resending ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block"
            ></motion.div>
          ) : resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
        </button>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="px-4 py-2 bg-gray-600 rounded-lg border border-gray-500 shadow-md flex items-center justify-center w-24"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block"
            ></motion.div>
          ) : (
            "Verify"
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default OtpVerificationModal;
