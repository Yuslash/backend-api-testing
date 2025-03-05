import { useState } from 'react'
import { FaGithub, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import colorPalettes from './ColorPalettes'

const SocialLinks = ({ github, setGithub, instagram, setInstagram, portfolio, setPortfolio, theme, additionalEmail, setAdditionalEmail }) => {
  const [isEditing, setIsEditing] = useState(false)
  const styles = colorPalettes[theme] || colorPalettes.gray

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleUpdate = () => {
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* GitHub */}
      <div className="flex items-center space-x-3">
        <FaGithub className={`text-2xl ${styles.iconColor}`} />
        <input
          type="text"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className={`w-full p-4 ${styles.placeholder} rounded-lg ${styles.inputBg} ${styles.softShadow} ${styles.text} focus:ring-2 focus:ring-${styles.focusRing} transition`}
          placeholder="GitHub URL"
          disabled={!isEditing}
        />
      </div>

      {/* Instagram */}
      <div className="flex items-center space-x-3">
        <FaInstagram className={`text-2xl ${styles.iconColor}`} />
        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className={`w-full p-4 ${styles.placeholder} rounded-lg ${styles.inputBg} ${styles.softShadow} ${styles.text} focus:ring-2 focus:ring-${styles.focusRing} transition`}
          placeholder="Instagram URL"
          disabled={!isEditing}
        />
      </div>

      {/* Portfolio */}
      <div className="flex items-center space-x-3">
        <FaLinkedin className={`text-2xl ${styles.iconColor}`} />
        <input
          type="text"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          className={`w-full p-4 ${styles.placeholder} rounded-lg ${styles.inputBg} ${styles.softShadow} ${styles.text} focus:ring-2 focus:ring-${styles.focusRing} transition`}
          placeholder="Portfolio URL"
          disabled={!isEditing}
        />
      </div>

      {/* Additional Email */}
      <div className="flex items-center space-x-3">
        <FaEnvelope className={`text-2xl ${styles.iconColor}`} />
        <input
          type="email"
          value={additionalEmail}
          onChange={(e) => setAdditionalEmail(e.target.value)}
          className={`w-full p-4 ${styles.placeholder} rounded-lg ${styles.inputBg} ${styles.softShadow} ${styles.text} focus:ring-2 focus:ring-${styles.focusRing} transition`}
          placeholder="Additional Email"
          disabled={!isEditing}
        />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end">
        {!isEditing ? (
          <button onClick={handleEdit} className={`px-6 py-2 rounded-lg ${styles.button} ${styles.buttonText} hover:bg-opacity-80 hover:text-white transition`}>
            Edit
          </button>
        ) : (
          <button onClick={handleUpdate} className={`px-6 py-2 rounded-lg ${styles.button} ${styles.text} hover:bg-opacity-80 hover:text-white transition`}>
            Update
          </button>
        )}
      </div>
    </div>
  )
}

export default SocialLinks
