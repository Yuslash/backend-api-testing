import { useEffect, useState } from "react"
import axios from "axios"
import server from "../../../host.js"

const useEmailVerification = (pathname) => {
  const url = `http://${server.host}:${server.port}`
  const [isVerified, setIsVerified] = useState(null)

  useEffect(() => {
    setIsVerified(null)

    const fetchVerificationStatus = async () => {
      try {
        const response = await axios.post(`${url}/auth/check-email-verification`, {}, { withCredentials: true })
        console.log("Email Verification Status:", response.data.success)

        setTimeout(() => {
          setIsVerified(response.data.success)
        }, 10)
      } catch (error) {
        console.error("Error fetching email verification status:", error)
        setIsVerified(false)
      }
    }

    fetchVerificationStatus()
  }, [pathname])

  return isVerified
}

export default useEmailVerification
