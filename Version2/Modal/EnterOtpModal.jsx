// EnterOtpModal.js
import { motion } from 'framer-motion';

const EnterOtpModal = ({
  email,
  otp,
  onChange,
  onKeyDown,
  onSubmit,
  onResendOtp,
  isSubmitting,
  isSendingOtp,
  cooldown,
  error,
  successMessage,
  inputRefs,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className="bg-gray-800 border border-gray-600 p-8 rounded-2xl shadow-xl w-[90%] max-w-md text-center text-gray-300 font-mono"
  >
    <h2 className="text-2xl font-semibold text-gray-400">🔐 Enter OTP</h2>
    <p className="mt-2 text-gray-300">A 6-digit code has been sent to {email}</p>
    <div className="mt-5 flex justify-center gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          className="w-12 h-12 text-center text-xl border border-gray-600 bg-gray-700 text-gray-300 rounded-md"
          disabled={isSubmitting || !!successMessage}
        />
      ))}
    </div>
    {error && <p className="text-red-500 mt-3">{error}</p>}
    {successMessage && <p className="text-green-400 mt-3">{successMessage}</p>}
    <div className="mt-5 flex justify-between">
      <button
        disabled={isSendingOtp || !!successMessage || cooldown > 0}
        onClick={onResendOtp}
        className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-500 shadow-md disabled:opacity-50"
      >
        {cooldown > 0 ? `Resend OTP (${cooldown})` : isSendingOtp ? 'Sending...' : 'Resend OTP'}
      </button>
      <button
        onClick={onSubmit}
        disabled={isSubmitting || !!successMessage}
        className="px-4 py-2 bg-gray-600 rounded-lg border border-gray-500 shadow-md disabled:opacity-50"
      >
        {isSubmitting ? 'Verifying...' : 'Submit'}
      </button>
    </div>
  </motion.div>
);

export default EnterOtpModal;
