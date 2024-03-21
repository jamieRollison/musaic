import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from "axios"

// async function fetchRecentlyPlayedTracks(token) {
//   try {
//     // Calculate the timestamp for one year ago
//     const oneYearAgo = new Date();
//     oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

//     const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
//       headers: {
//         'Authorization': 'Bearer ' + token
//       },
//       params: {
//         limit: 50,
//         after: Math.floor(oneYearAgo / 1000)
//       }
//     });

//     // Extract track IDs from the response
//     const trackIds = response.data.items.map(item => item.track.id);

//     // Fetch detailed track information for the extracted track IDs
//     const tracksDetailsResponse = await axios.get('https://api.spotify.com/v1/tracks', {
//       headers: {
//         'Authorization': 'Bearer ' + token
//       },
//       params: {
//         ids: trackIds.join(',')
//       }
//     });

//     const tracksAudioFeaturesResponse = await axios.get('https://api.spotify.com/v1/audio-features', {
//       headers: {
//         'Authorization': 'Bearer ' + token
//       },
//       params: {
//         ids: trackIds.join(',')
//       }
//     });
//     // console.log('Audio features:', tracksAudioFeaturesResponse.data.audio_features);

//     // Extract required information from the detailed track information
//     const tracksWithDetails = await Promise.all(tracksDetailsResponse.data.tracks.map(async track => {
//       const artistNames = track.artists.map(artist => artist.name);
//       console.log('Artists:', artistNames);
//       const audioFeature = tracksAudioFeaturesResponse.data.audio_features.find(feature => feature.id === track.id);
//       // console.log('Audio feature for track:', track.id, audioFeature);

//       return {
//         id: track.id,
//         name: track.name,
//         artists: artistNames,
//         // artists: artists.map(artist => artist.name), // Extracting only artist names for simplicity
//         played_at: response.data.items.find(item => item.track.id === track.id).played_at,
//         valence: audioFeature.valence,              // Musical positiveness conveyed by a track 0 to 1
//         mode: audioFeature.mode,                    // Minor: 0 -> Major: 1
//         danceability: audioFeature.danceability,    // how suitable a track is for dancing 
//         energy: audioFeature.energy                 // Perceptual measure of intensity and activity
//       };
//     }));
//     return tracksWithDetails;

//   } catch (error) {
//     console.error('Error fetching recently played tracks:', error.message);
//     throw error;
//   }
// }

const Login = () => {
  const [params, _setParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('')
  const redirect = useNavigate()
  const base = import.meta.env.PROD ? 'https://musaic-psi.vercel.app' : 'http://localhost:5173'

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
              redirect_uri: `${base}/login`,
              grant_type: 'authorization_code',
              client_id: import.meta.env.VITE_OTHER_ID,
              client_secret: import.meta.env.VITE_OTHER_SECRET
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

            redirect('/visualization') // redirect after logging in

            // Recently Played Tracks
            // fetchRecentlyPlayedTracks(token)
            // .then(recentlyPlayedTracks => {
            //   console.log('Recently played tracks:');
            //   recentlyPlayedTracks.forEach((track, index) => {
            //       console.log(`${index + 1}. ${track.name}`);
            //       console.log(`Artist(s): ${track.artists}`);
            //       console.log(`Played at: ${track.played_at}`);
            //       console.log(`Valence: ${track.valence}`);
            //       console.log(`Mode: ${track.mode}`);
            //       console.log(`Danceability: ${track.danceability}`);
            //       console.log(`Energy: ${track.energy}`);
            //       console.log('------------------------');
            //   });
            // })
            // .catch(error => {
            //   console.error('Failed to fetch recently played tracks:', error);
            // });

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