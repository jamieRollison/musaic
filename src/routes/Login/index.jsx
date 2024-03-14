import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from "axios"
import { encode } from 'base-64'

const Login = () => {
  const [params, _setParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('')
  const redirect = useNavigate()

  useEffect(() => {
    const getToken = async () => {
      const code = params.get('code')

      if (!code) {
        setErrorMessage(params.get('error'))
      } else {
        const res = await axios({
          method: "post",
          url: "https://accounts.spotify.com/api/token",
          data: {
            code: code,
            redirect_uri: 'http://localhost:5173/login',
            grant_type: 'client_credentials'
          },
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encode(import.meta.env.VITE_CLIENT_ID + ':' + import.meta.env.VITE_CLIENT_SECRET)
          },
          json: true
        })

        const token = res.data.access_token
        if (token) {
          window.localStorage.setItem('token', token)
          redirect('/') // redirect after logging in
        } else {
          setErrorMessage(res.data.error_description)
        }
      }

    }
    getToken();

  }, [params, redirect])
  return (
    <>
    {!errorMessage ?
      <p>logging you in...</p> : 
      <div>
        <p>error:</p> 
        <p>{errorMessage}</p>
      </div> 
    }
    </>
  )
}

export default Login