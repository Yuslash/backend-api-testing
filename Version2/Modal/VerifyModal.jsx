// VerifyModal.js
import { motion } from 'framer-motion';

const VerifyModal = ({ onVerify }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className="bg-gray-800 border border-gray-600 p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-gray-300 font-mono relative overflow-hidden"
  >
    <h2 className="text-xl font-semibold text-gray-400 animate-pulse">⚠ VERIFY NOW</h2>
    <p className="mt-3 text-gray-300 animate-blink">
      Verify your email to continue. Check your inbox for a verification link.
    </p>
    <div className="mt-5 flex justify-end">
      <button
        onClick={onVerify}
        className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 border border-gray-500 shadow-md animate-pulse"
      >
        VERIFY NOW
      </button>
    </div>
  </motion.div>
);

export default VerifyModal;
