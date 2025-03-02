// EmailVerificationModal.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VerifyModal from "./VerifyModal";
import SendOtpModal from "./SendOtpModal";
import EnterOtpModal from "./EnterOtpModal";
import server from "../../../host";
import "./EmailModal.css";

const EmailVerificationModal = ({ isOpen }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  // persist OTP sent state using localStorage as backup
  const [otpSent, setOtpSent] = useState(() => {
    const stored = localStorage.getItem("otpSent");
    return stored ? JSON.parse(stored) : false;
  });
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  // When OTP modal is shown, fetch remaining cooldown if email is available.
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
          console.error("Error fetching cooldown:", error);
        }
      };
      fetchRemainingCooldown();
    }
  }, [showOTP, email]);

  // Timer countdown effect for the resend OTP cooldown
  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  // Fetch the user's email when the OTP modal is shown
  useEffect(() => {
    if (showOTP && !email) {
      const fetchEmail = async () => {
        try {
          const response = await axios.get(
            `http://${server.host}:${server.port}/api/user/email`,
            { withCredentials: true }
          );
          if (response.data?.email) {
            setEmail(response.data.email);
          } else {
            setError("Failed to fetch email");
          }
        } catch {
          setError("Error fetching email");
        }
      };
      fetchEmail();
    }
  }, [showOTP, email]);

  // NEW: Check if an OTP has already been sent by using the /check-otp API.
  // IMPORTANT: If the OTP exists (response.data.exists is true),
  // we automatically set otpSent and show the EnterOtpModal.
  useEffect(() => {
    if (email) {
      const checkOtpStatus = async () => {
        try {
          const response = await axios.get(
            `http://${server.host}:${server.port}/check-otp`,
            { params: { email }, withCredentials: true }
          );
          if (response.data.exists) {
            setOtpSent(true);
            setShowOTP(true); // Automatically show OTP entry modal.
            localStorage.setItem("otpSent", true);
          } else {
            setOtpSent(false);
            localStorage.removeItem("otpSent");
          }
        } catch (error) {
          console.error("Error checking OTP status:", error);
          setOtpSent(false);
          localStorage.removeItem("otpSent");
        }
      };
      checkOtpStatus();
    }
  }, [email]);

  // Handle sending OTP. On success, persist the flag and update the modal state.
  const handleSendOtp = async () => {
    if (isSendingOtp || cooldown > 0) return;
    setIsSendingOtp(true);
    setError("");
    try {
      const response = await axios.post(
        `http://${server.host}:${server.port}/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      if (response.data.success) {
        localStorage.setItem("otpSent", true);
        setOtpSent(true);
        setShowOTP(true);
        setCooldown(30); // initial cooldown period
      } else {
        const waitMatch = response.data.message?.match(/Wait (\d+) seconds/);
        if (waitMatch) {
          setCooldown(parseInt(waitMatch[1]));
        }
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      const waitMatch = error.response?.data?.message?.match(/Wait (\d+) seconds/);
      if (waitMatch) {
        setCooldown(parseInt(waitMatch[1]));
      }
      setError(error.response?.data?.message || "Error sending OTP");
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

  // Handle backspace for OTP inputs
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle OTP submission. On successful verification, remove the OTP sent flag.
  const handleSubmit = async () => {
    if (isSubmitting || successMessage) return;
    setIsSubmitting(true);
    setError("");
    try {
      const otpCode = otp.join("");
      if (otpCode.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        setIsSubmitting(false);
        return;
      }
      const response = await axios.post(
        `http://${server.host}:${server.port}/auth/verify-otp`,
        { email, otp: otpCode },
        { withCredentials: true }
      );
      if (response.data.success) {
        setSuccessMessage("✅ OTP verified!");
        localStorage.removeItem("otpSent");
        navigate("/profile");
      } else {
        setError("Invalid OTP. Try again");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error verifying OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendering logic:
  // If otpSent is true (i.e. an OTP exists and is valid) we always show EnterOtpModal.
  // Otherwise, if showOTP is false, show the initial VerifyModal.
  // Else, show the SendOtpModal.
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-end justify-end">
      {otpSent ? (
        <EnterOtpModal
          email={email}
          otp={otp}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
          onResendOtp={handleSendOtp}
          isSubmitting={isSubmitting}
          isSendingOtp={isSendingOtp}
          cooldown={cooldown}
          error={error}
          successMessage={successMessage}
          inputRefs={inputRefs}
        />
      ) : !showOTP ? (
        <VerifyModal onVerify={() => setShowOTP(true)} />
      ) : (
        <SendOtpModal
          email={email}
          onSendOtp={handleSendOtp}
          isSendingOtp={isSendingOtp}
          cooldown={cooldown}
          error={error}
        />
      )}
    </div>
  );
};

export default EmailVerificationModal;
