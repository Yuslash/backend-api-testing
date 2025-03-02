import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Head.css';
import icons from '../../assets/images/img.js';
import OtpVerificationModal from '../../OTPVerification/OtpVerificationModal.jsx';
import VerifyModal from '../../OTPVerification/VerifyModal.jsx';
import getUserDetails from '../../api/userData.js';
import server from '../../../host.js';
import axios from 'axios';
import SendOtpModal from '../../OTPVerification/SendOtpModal.jsx';

const url = `http://${server.host}:${server.port}`;

const Header = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate(); // Initialize navigate
    const [email, setEmail] = useState('');
    const [emailVerified, setEmailVerified] = useState(true);
    const [otpExists, setOtpExists] = useState(false);
    const [showSendOtpModal, setShowSendOtpModal] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            const data = await getUserDetails('/api/user/email');
            console.log(data);
            setEmail(data);
        };

        const checkVerification = async () => {
            const response = await axios.post(`${url}/auth/check-email-verification`, {}, { withCredentials: true });
            setEmailVerified(response.data.success);
        };

        fetchDetails();
        checkVerification();
    }, []);

    useEffect(() => {
        if (!email) return;

        const checkOtpSent = async () => {
            const response = await axios.post(`${url}/auth/check-otp`, { email });
            setOtpExists(response.data.exists);
        };

        checkOtpSent();
    }, [email]);

    const handleSendOtp = async () => {
        const response = await axios.post(`${url}/auth/send-otp`, { email }, { withCredentials: true });
        if (response.data.success) {
            setOtpExists(true);
            setShowSendOtpModal(false);
        }
    };

    const handleVerifyOtp = async (otp) => {
        const response = await axios.post(`${url}/auth/verify-otp`, { email, otp }, { withCredentials: true });
        if (response.data.success) {
            setEmailVerified(true);
            setOtpExists(false);
        }
        return response.data;
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    // Handle Logout
    const handleLogout = () => {
        // Perform logout logic (e.g., clear session, tokens, etc.)
        // Navigate to the login page
        navigate('/login');
    };

    return (
        <div className='header'>
            <div className='profile-icon'>
                <ul>
                    <li className='brand-name'>
                        <Link to="/home">billionoillidCTF</Link>
                    </li>
                </ul>
            </div>
            <div className='nav-section'>
                <ul className='site-navigation'>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/events">Events</Link></li>
                    <li><Link to="/arena">Arena</Link></li>
                    <li><Link to="/leaderboard">Board</Link></li>
                    <li><Link to="/shop">Shop</Link></li>
                </ul>
            </div>
            <div className='profile-icon'>
                <div onClick={toggleDropdown}>
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjgXPtoWRoJmNpyyJIJuEyvFacWk-DOg4Tcw&s" 
                        alt="Profile Icon" 
                        className="profile-image" 
                    />
                    {isDropdownVisible && (
                        <div className="dropdown-menu">
                            <ul>
                                <li onClick={() => navigate('/profile')}>
                                    <img className='img-1' src={icons.icons.profile.User.src} alt="" />
                                    <h3>Profile</h3>
                                </li>
                                <li onClick={() => navigate('/profile')}>
                                    <img className='img-1' src={icons.icons.profile.Settings.src} alt="" />
                                    <h3>Settings</h3>
                                </li>
                                <li onClick={handleLogout}>
                                    <img className='img-1' src={icons.icons.profile.logout.src} alt="" />    
                                    <h3>Logout</h3>
                                </li> 
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Email verification modals */}
            {!emailVerified && otpExists ? (
                <OtpVerificationModal 
                    isOpen={true} 
                    email={email} 
                    onClose={() => setOtpExists(false)} 
                    verifyOtp={handleVerifyOtp} 
                />
            ) : !emailVerified && !otpExists ? (
                <VerifyModal 
                    isOpen={true} 
                    onClose={() => setShowSendOtpModal(false)}
                    onVerify={() => {setShowSendOtpModal(true)}} 
                />
            ) : null}

            {showSendOtpModal && (
                <SendOtpModal 
                    isOpen={showSendOtpModal}
                    email={email}
                    onClose={() => setShowSendOtpModal(false)}
                    onOtpSent={() => setOtpExists(true)}
                    sendOtp={handleSendOtp}
                /> 
            )}
        </div>
    );
};

export default Header;