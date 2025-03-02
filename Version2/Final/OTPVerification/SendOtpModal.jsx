import { motion } from "framer-motion";
import { useState } from "react";

const SendOtpModal = ({ isOpen, email, onClose, onOtpSent, sendOtp }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    setLoading(true);
    await sendOtp(email);
    onOtpSent();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed bottom-4 right-4 z-[999] p-10 bg-gray-800 border border-gray-600 rounded-2xl shadow-xl w-[90%] max-w-md text-center text-gray-300 font-mono"
    >
      <h2 className="text-2xl font-semibold text-gray-400">📩 Send OTP</h2>
      <p className="mt-2 text-gray-300">Click the button below to receive an OTP on your email</p>
      <div className="mt-5 flex justify-center">
      <button
        onClick={handleSendOtp}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-gray-500 shadow-md transition-all disabled:opacity-50 flex items-center justify-center w-28"
        disabled={loading}
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block"
          ></motion.div>
        ) : (
          "Send OTP"
        )}
      </button>

      </div>
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl">
        &times;
      </button>
    </motion.div>
  );
};

export default SendOtpModal;