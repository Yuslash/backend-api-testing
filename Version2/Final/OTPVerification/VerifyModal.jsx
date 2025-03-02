import { motion } from "framer-motion";

const VerifyModal = ({ isOpen, onClose, onVerify }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed bottom-4 right-4 z-[999] p-6 bg-gray-800 border border-gray-600 rounded-2xl shadow-xl w-[90%] max-w-md text-center text-gray-300 font-mono"
    >
      <h2 className="text-2xl font-semibold text-gray-400">📩 Email Verification Required</h2>
      <p className="mt-2 text-gray-300">Your email is not verified. Please verify to continue.</p>
      <div className="mt-5 flex justify-center">
        <button
          onClick={onVerify}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-gray-500 shadow-md transition-all"
        >
          Verify Now
        </button>
      </div>
    </motion.div>
  );
};

export default VerifyModal;
