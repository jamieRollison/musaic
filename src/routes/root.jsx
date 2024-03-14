import { useSearchParams } from 'react-router-dom'
import musaicLogo from '/musaic-logo.svg'

function Root() {
    function generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
          randomString += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return randomString;
    }

    const REDIRECT_URI = 'http://localhost:5173/login';
    const SCOPES = 'user-read-private user-read-email user-read-recently-played';

    const spotify_params = useSearchParams({
      response_type: 'code',
      client_id: import.meta.env.VITE_CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      state: generateRandomString(16)
    })
    console.log(spotify_params.toString())

    const spoitfy_url = 'https://accounts.spotify.com/authorize?' + spotify_params.toString()

    return (
      <>
        <img src={musaicLogo}/>
        <a href={spoitfy_url}>login</a>
      </>
    )
}

export default Root