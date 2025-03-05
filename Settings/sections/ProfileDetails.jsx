import { useRef, useState } from 'react'
import colorPalettes from './ColorPalettes'
import '../profile.css'

const ProfileDetails = ({ country, setCountry, email, setEmail, imageUrl, setImageUrl, theme }) => {
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef(null)
  const styles = colorPalettes[theme] || colorPalettes.gray

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImageUrl(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing)
  }

  return (
    <div className="space-y-5">
      {/* Profile Image Upload */}

      <div className="flex flex-col items-start">
          <div 
            className={`w-32 h-32 rounded-full ${styles.inputBg} flex items-center justify-center overflow-hidden border-4 ${styles.inputBorder} cursor-pointer`}
            onClick={() => fileInputRef.current.click()}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className={styles.text}>Upload</span>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
        </div>


      <div className=' flex justify-between items-center'>

      <h1 className={`${styles.text} text-2xl font-semibold`}>Sibi Krishna</h1>
        
        <button className={` ${styles.button} p-4 rounded-lg`}>Download Config</button>
      
      </div>

      {/* Country, Email & Additional Email Inputs */}
      <input 
        type="text" 
        value={country} 
        onChange={(e) => setCountry(e.target.value)} 
        className={`w-full p-3 rounded-lg ${styles.inputBg} ${styles.text} ${styles.placeholder}`} 
        placeholder="Country" 
        disabled={!isEditing} 
      />
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className={`w-full p-3 rounded-lg ${styles.inputBg} ${styles.text} ${styles.placeholder}`} 
        placeholder="Email" 
        disabled={!isEditing} 
      />

      {/* Edit and Update button */}
      <div className='w-full flex items-center justify-end'>
        <button 
          onClick={handleEditClick} 
          className={`py-2 px-6 ${styles.button} rounded-md`}
        >
          {isEditing ? 'Update' : 'Edit'}
        </button>
      </div>
    </div>
  )
}

export default ProfileDetails
