// SendOtpModal.js
import { motion } from 'framer-motion';

const SendOtpModal = ({ email, onSendOtp, isSendingOtp, cooldown, error }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className="bg-gray-800 border border-gray-600 p-8 rounded-2xl shadow-xl w-[90%] max-w-md text-center text-gray-300 font-mono"
  >
    <h2 className="text-2xl font-semibold text-gray-400">📧 Verify Email</h2>
    <p className="mt-2 text-gray-300">Your email: {email}</p>
    <button
      onClick={onSendOtp}
      disabled={isSendingOtp || cooldown > 0}
      className="mt-5 px-4 py-2 bg-gray-700 rounded-lg border border-gray-500 shadow-md disabled:opacity-50"
    >
      {cooldown > 0 ? `Resend OTP (${cooldown})` : isSendingOtp ? 'Sending...' : 'Send OTP'}
    </button>
    {error && <p className="text-red-500 mt-3">{error}</p>}
  </motion.div>
);

export default SendOtpModal;
