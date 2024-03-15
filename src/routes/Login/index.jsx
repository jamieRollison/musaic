import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from "axios"
import { encode } from 'base-64'

const Login = () => {
  const [params, _setParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('')
  const redirect = useNavigate()

  useEffect(() => {
    let ignore = false;
    const getToken = async () => {
      const code = params.get('code')
      console.log(params.toString())

      if (!code) {
        setErrorMessage(params.get('error'))
      } else {
        try {
          const res = await axios({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            data: {
              code: code,
              redirect_uri: 'http://localhost:5173/login',
              grant_type: 'authorization_code',
              client_id: import.meta.env.VITE_CLIENT_ID,
              client_secret: import.meta.env.VITE_CLIENT_SECRET
            },
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            json: true
          })
        

          const token = res.data.access_token
          if (token) {
            console.log(res)
            window.localStorage.setItem('token', token)
            console.log("new token: ", window.localStorage.getItem('token', token))

            redirect('/') // redirect after logging in
          } else {
            setErrorMessage(res.data.error_description)
          }
        } catch(e) {
          console.log(e)
        }
      }

    }
    if (!ignore)
      getToken().catch(e => console.log(e))
    return () => {
      ignore = true
    }

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