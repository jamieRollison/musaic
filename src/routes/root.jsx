import { useSearchParams } from 'react-router-dom'
import musaicLogo from '/musaic-logo.svg'
import { useEffect } from 'react';
import axios from 'axios';

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
    const state = generateRandomString(16)

    const spotify_params = useSearchParams({
      response_type: 'code',
      client_id: import.meta.env.VITE_CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      state: state
    })
    console.log(spotify_params.toString())

    useEffect(() => {
      async function fetchRecentlyPlayedTracks(accessToken) {
      console.log("accessToken: ", accessToken);
      try {
        const {data} = await axios({
          method: 'get',
          url: 'https://api.spotify.com/v1/me/player/recently-played',
          headers: {
            'Authorization': 'Bearer ' + accessToken
          },
          params: {
            // limits the number of tracks to 10, this should be changed
            limit: 10
          }
        });

        // Extract and return the list of recently played tracks
        return data.items;
      } catch (error) {
        console.error('Error fetching recently played tracks:', error.message);
        throw error;
      }
    }

      const token = window.localStorage.getItem('token')
      if (token)
        fetchRecentlyPlayedTracks(token)
    })

    const spoitfy_url = 'https://accounts.spotify.com/authorize?' + spotify_params.toString().split(',')[0]
    console.log(spoitfy_url)

    return (
      <>
        <img src={musaicLogo}/>
        <a href={spoitfy_url}>login</a>
      </>
    )
}

export default Root