import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import './EmailModal.css'
import { useNavigate } from 'react-router-dom';

const EmailVerificationModal = ({ isOpen }) => {
  if (!isOpen) return null;

  const navigate = useNavigate()

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-end justify-end">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-black border border-green-500 p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-green-400 font-mono relative overflow-hidden"
      >
        <h2 className="text-xl font-semibold text-green-500 animate-pulse">⚠ VERIFY NOW</h2>
        <p className="mt-3 text-green-400 animate-blink">
          Verify your email to continue.
          Check your inbox for a verification link.
        </p>
        <div className="mt-5 flex justify-end">
          <button
            onClick={()=> navigate('/emailVerify')}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 border border-green-400 shadow-md animate-pulse"
          >
            VERIFY NOW
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationModal;