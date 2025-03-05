import { useState } from 'react'
import colorPalettes from './ColorPalettes'

const PasswordSection = ({ currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, theme }) => {
  const styles = colorPalettes[theme] || colorPalettes.gray

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isEditable, setIsEditable] = useState(false)

  const handleFocus = () => {
    setIsEditable(true)
  }

  const handleUpdatePasswordClick = () => {
    setIsEditable(false)
  }

  const handleCancelClick = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setIsEditable(false)
  }

  return (
    <div className="space-y-6">
      {/* Current Password */}
      <div className="relative">
        <input 
          type={showCurrentPassword ? 'text' : 'password'} 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
          onFocus={handleFocus} 
          className={`w-full p-4 ${styles.placeholder} ${styles.softShadow} rounded-lg ${styles.inputBg} ${styles.text} focus:ring-2 focus:ring-${styles.focusRing} transition`} 
          placeholder="Current Password" 
        />
        <button 
          type="button" 
          onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          {showCurrentPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* New Password */}
      <div className="relative">
        <input 
          type={showNewPassword ? 'text' : 'password'} 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          onFocus={handleFocus} 
          className={`w-full p-4 ${styles.placeholder} ${styles.softShadow} rounded-lg ${styles.inputBg} ${styles.text} focus:ring-2 focus:ring-${styles.focusRing} transition`} 
          placeholder="New Password" 
        />
        <button 
          type="button" 
          onClick={() => setShowNewPassword(!showNewPassword)} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          {showNewPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input 
          type={showConfirmPassword ? 'text' : 'password'} 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          onFocus={handleFocus} 
          className={`w-full p-4 ${styles.placeholder} ${styles.softShadow} rounded-lg ${styles.inputBg} ${styles.text} focus:ring-2 focus:ring-${styles.focusRing} transition`} 
          placeholder="Confirm Password" 
        />
        <button 
          type="button" 
          onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          {showConfirmPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Buttons */}
      {isEditable && (
        <div className="flex space-x-4">
          <button 
            type="button" 
            onClick={handleUpdatePasswordClick} 
            className={`w-full p-4 rounded-lg ${styles.softShadow} ${styles.button} hover:bg-opacity-80 transition`}
          >
            Update Password
          </button>
          <button 
            type="button" 
            onClick={handleCancelClick} 
            className={`w-full p-4 rounded-lg border ${styles.text} hover:text-white ${styles.inputBorder} ${styles.buttonHover} text-white`}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default PasswordSection
