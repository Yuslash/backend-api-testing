import { Navigate } from "react-router-dom";
import useEmailVerification from "./useEmailVerification";
import OTPVerification from "./EmailVerificationPage";

const ProtectedEmailVerify = () => {
  const isVerified = useEmailVerification();

  if (isVerified === null) return null; // Wait for verification check

  return isVerified ? <Navigate to="/home" /> : <OTPVerification />;
};

export default ProtectedEmailVerify;
