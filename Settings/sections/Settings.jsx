import { useState } from 'react'
import { motion } from 'framer-motion'
import Preferences from './sections/Preference.jsx'
import ProfileDetails from './sections/ProfileDetails.jsx'
import SocialLinks from './sections/SocialLinks.jsx'
import PasswordSection from './sections/PasswordSection.jsx'
import colorPalettes from './sections/ColorPalettes.js'
import './profile.css'

const Settings = ({ isOpen, onClose, theme, setTheme }) => {
  const [activeTab, setActiveTab] = useState('imageUrl')

  const [country, setCountry] = useState('India')
  const [imageUrl, setImageUrl] = useState('')
  const [github, setGithub] = useState('')
  const [instagram, setInstagram] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [additionalEmail, setAdditionalEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')

  const tabs = [
    { key: 'imageUrl', label: 'Profile Details' },
    { key: 'social', label: 'Social Links' },
    { key: 'password', label: 'Password' },
    { key: 'preferences', label: 'Preferences' },
  ]

  const themeStyles = colorPalettes[theme] || colorPalettes.gray

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center text-gray-200 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`${themeStyles.bg} p-8 rounded-2xl w-[900px] max-w-full flex shadow-2xl border border-gray-700`}
      >
        {/* Sidebar Tabs */}
        <div className={`w-1/3 border-r ${themeStyles.borderColor} p-4 space-y-6 flex flex-col justify-between`}>
          <div>
            <h2 className={`text-lg font-bold mb-4 ${themeStyles.text}`}>Settings</h2>
            <div className="flex flex-col space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-left px-4 py-3 font-semibold rounded-lg ${themeStyles.text} transition-all duration-300 ${
                    activeTab === tab.key ? themeStyles.tabActive : themeStyles.tabHover
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Close Button at the end */}
          <button
            onClick={onClose}
            className={`${themeStyles.closeButton} text-white px-5 py-3 rounded-lg transition-all shadow-md`}
          >
            Close
          </button>
        </div>

        {/* Content Area */}
        <div className="w-2/3 p-6">
          <h3 className={`text-xl font-semibold mb-4 ${themeStyles.text}`}>
            {tabs.find((t) => t.key === activeTab)?.label}
          </h3>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            {activeTab === 'social' ? (
              <SocialLinks github={github} setGithub={setGithub} instagram={instagram} setInstagram={setInstagram} portfolio={portfolio} setPortfolio={setPortfolio} theme={theme} />
            ) : activeTab === 'password' ? (
              <PasswordSection currentPassword={currentPassword} setCurrentPassword={setCurrentPassword} newPassword={newPassword} setNewPassword={setNewPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} theme={theme} />
            ) : activeTab === 'preferences' ? (
              <Preferences theme={theme} setTheme={setTheme} />
            ) : (
              <ProfileDetails country={country} setCountry={setCountry} email={email} setEmail={setEmail} additionalEmail={additionalEmail} setAdditionalEmail={setAdditionalEmail} imageUrl={imageUrl} setImageUrl={setImageUrl} theme={theme} />
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings
