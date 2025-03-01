import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import server from "../../../host"

const generateParticles = (count, width, height) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 5 + 3,
    rotation: Math.random() * 360
  }))
}

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [particles, setParticles] = useState(() => generateParticles(50, window.innerWidth, window.innerHeight))
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const inputRefs = useRef([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(`http://${server.host}:${server.port}/api/user/email`, { withCredentials: true })
        if (response.data?.email) {
          setEmail(response.data.email)
        } else {
          setError("Failed to fetch email")
        }
      } catch {
        setError("Error fetching email")
      }
    }
    fetchEmail()
  }, [])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleSendOtp = async () => {
    if (timer > 0 || isSendingOtp) return
    setIsSendingOtp(true)
    setError("")
    try {
      const response = await axios.post(`http://${server.host}:${server.port}/auth/send-otp`, { email }, { withCredentials: true })
      if (response.data.success) {
        setOtpSent(true)
        setTimer(60)
      } else {
        setError(response.data.message || "Failed to send OTP")
      }
    } catch {
      setError("Error sending OTP")
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleChange = (index, value) => {
    if (/[^0-9]/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      } else if (index > 0) inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting || successMessage) return
    setIsSubmitting(true)
    setError("")
    try {
      const otpCode = otp.join("")
      if (otpCode.length !== 6) {
        setError("Please enter a valid 6-digit OTP")
        return
      }

      const response = await axios.post(
        `http://${server.host}:${server.port}/auth/verify-otp`,
        { email, otp: otpCode },
        { withCredentials: true }
      )

      if (response.data.success) {
        setSuccessMessage("✅ OTP verified! Redirecting...")
        setTimeout(() => navigate("/home"), 2000)
      } else {
        setError("Invalid OTP. Try again")
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error verifying OTP")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center h-screen w-screen bg-black text-green-400 font-mono overflow-hidden">
      {otpSent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black border border-green-500 p-8 rounded-2xl shadow-xl w-full max-w-md text-center"
        >
          <h2 className="text-2xl font-semibold text-green-500">🔐 Enter OTP</h2>
          <p className="mt-2 text-green-400">A 6-digit code has been sent to {email}</p>
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
                className="w-12 h-12 text-center text-xl border border-green-500 bg-black text-green-400 rounded-md"
                disabled={isSubmitting || !!successMessage}
              />
            ))}
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
          {successMessage && <p className="text-green-500 mt-3">{successMessage}</p>}
          <div className="mt-5 flex justify-between">
            <button 
              disabled={timer > 0 || isSendingOtp || !!successMessage}
              onClick={handleSendOtp}
              className="px-4 py-2 bg-green-700 rounded-lg border border-green-400 shadow-md disabled:opacity-50"
            >
              {isSendingOtp ? "Sending..." : (timer > 0 ? `Resend in ${timer}s` : "Resend OTP")}
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !!successMessage}
              className="px-4 py-2 bg-green-600 rounded-lg border border-green-400 shadow-md disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Submit"}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black border border-green-500 p-8 rounded-2xl shadow-xl w-full max-w-md text-center"
        >
          <h2 className="text-2xl font-semibold text-green-500">📧 Verify Email</h2>
          <p className="mt-2 text-green-400">Your email: {email}</p>
          <button 
            onClick={handleSendOtp}
            disabled={isSendingOtp}
            className="mt-5 px-4 py-2 bg-green-700 rounded-lg border border-green-400 shadow-md disabled:opacity-50"
          >
            {isSendingOtp ? "Sending..." : "Send OTP"}
          </button>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </motion.div>
      )}
    </div>
  )
}

export default OTPVerification