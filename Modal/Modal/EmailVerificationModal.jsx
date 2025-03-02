import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmailModal.css';
import server from '../../../host';

const generateParticles = (count, width, height) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 5 + 3,
    rotation: Math.random() * 360,
  }));
};

const EmailVerificationModal = ({ isOpen }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [particles, setParticles] = useState(() =>
    generateParticles(50, window.innerWidth, window.innerHeight)
  );
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [cooldown, setCooldown] = useState(0); // Timer state
  const inputRefs = useRef([]);

  // Fetch remaining cooldown when component mounts
  useEffect(() => {
    if (showOTP && email) {
      const fetchRemainingCooldown = async () => {
        try {
          const response = await axios.get(
            `http://${server.host}:${server.port}/auth/remaining-cooldown`,
            { params: { email }, withCredentials: true }
          );
          if (response.data.success) {
            setCooldown(response.data.remainingCooldown);
          }
        } catch (error) {
          console.error('Error fetching cooldown:', error);
        }
      };
      fetchRemainingCooldown();
    }
  }, [showOTP, email]);

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  // Fetch email when OTP modal is shown
  useEffect(() => {
    if (showOTP && !email) {
      const fetchEmail = async () => {
        try {
          const response = await axios.get(`http://${server.host}:${server.port}/api/user/email`, {
            withCredentials: true,
          });
          if (response.data?.email) {
            setEmail(response.data.email);
          } else {
            setError('Failed to fetch email');
          }
        } catch {
          setError('Error fetching email');
        }
      };
      fetchEmail();
    }
  }, [showOTP, email]);

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (isSendingOtp || cooldown > 0) return;
    setIsSendingOtp(true);
    setError('');
    try {
      const response = await axios.post(
        `http://${server.host}:${server.port}/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      if (response.data.success) {
        setOtpSent(true);
        setCooldown(30); // Set initial cooldown
      } else {
        const waitMatch = response.data.message?.match(/Wait (\d+) seconds/);
        if (waitMatch) {
          setCooldown(parseInt(waitMatch[1])); // Set cooldown from backend
        }
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      const waitMatch = error.response?.data?.message?.match(/Wait (\d+) seconds/);
      if (waitMatch) {
        setCooldown(parseInt(waitMatch[1])); // Set cooldown from backend
      }
      setError(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  // Handle OTP input backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP submission
  const handleSubmit = async () => {
    if (isSubmitting || successMessage) return;
    setIsSubmitting(true);
    setError('');
    try {
      const otpCode = otp.join('');
      if (otpCode.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }
      const response = await axios.post(
        `http://${server.host}:${server.port}/auth/verify-otp`,
        { email, otp: otpCode },
        { withCredentials: true }
      );
      if (response.data.success) {
        setSuccessMessage('✅ OTP verified!');
        navigate('/profile'); // Navigate to profile page
      } else {
        setError('Invalid OTP. Try again');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-end justify-end">
      {!showOTP ? (
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
              onClick={() => setShowOTP(true)}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 border border-gray-500 shadow-md animate-pulse"
            >
              VERIFY NOW
            </button>
          </div>
        </motion.div>
      ) : otpSent ? (
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
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
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
              onClick={handleSendOtp}
              className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-500 shadow-md disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend OTP (${cooldown})` : isSendingOtp ? 'Sending...' : 'Resend OTP'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !!successMessage}
              className="px-4 py-2 bg-gray-600 rounded-lg border border-gray-500 shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Submit'}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-gray-800 border border-gray-600 p-8 rounded-2xl shadow-xl w-[90%] max-w-md text-center text-gray-300 font-mono"
        >
          <h2 className="text-2xl font-semibold text-gray-400">📧 Verify Email</h2>
          <p className="mt-2 text-gray-300">Your email: {email}</p>
          <button
            onClick={handleSendOtp}
            disabled={isSendingOtp || cooldown > 0}
            className="mt-5 px-4 py-2 bg-gray-700 rounded-lg border border-gray-500 shadow-md disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend OTP (${cooldown})` : isSendingOtp ? 'Sending...' : 'Send OTP'}
          </button>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </motion.div>
      )}
    </div>
  );
};

export default EmailVerificationModal;