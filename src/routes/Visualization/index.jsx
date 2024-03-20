import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Visualization = () => {
  

  const token = window.localStorage.getItem('token')
  console.log(token)
  const [loaded, setLoaded] = useState(false)
  const [songs, setSongs] = useState([])
  const playlist_id = '4EK2TDhIoZSGtoOU71zvpn'
  useEffect(() => {
    console.log(loaded)
    const getData = async () => {
      let pl = []
      if (token && !loaded) {
        let url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?offset=600&limit=100&locale=en-US`
          try {
            // get the playlist from the api 100 songs at a time
            while(url) {
              const {data} = await axios({
                method: 'get',
                url: url,
                headers: {
                  'Authorization': 'Bearer ' + token
                },
              });

              pl.push(data.items)
              url = data.next
            }
            
            // extract id from each track
            const last_years_tracks = pl.map(sublist => sublist.filter(item => item.added_at.includes('2023')))
            const ids = last_years_tracks.map(sublist => sublist.map(item => item.track.id))


            const id_song_map = last_years_tracks.reduce((acc, sublist) =>
              sublist.reduce((acc, item) => {
                acc[item.track.id] = item.track.name + " - " + item.track.artists.map(artist => artist.name).join(', ')
                return acc
              }, acc)
            , {})

            const id_added_map = last_years_tracks.reduce((acc, sublist) =>
              sublist.reduce((acc, item) => {
                acc[item.track.id] = item.added_at
                return acc
              }, acc)
            , {})

            // get valence info on each track (also 100 at a time) and store it by month
            const empty_months = () => [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

            let all_valences = empty_months()
            for (let sublist of ids) {
              let url = `https://api.spotify.com/v1/audio-features?ids=${sublist.join(',')}`
              const {data} = await axios({
                method: 'get',
                url: url,
                headers: {
                  'Authorization': 'Bearer ' + token
                },
              });
              const valences = data.audio_features.reduce((acc, item) => {
                const month = parseInt(id_added_map[item.id].split('-')[1]) - 1
                acc[month][id_song_map[item.id]] = item.valence
                return acc
              }, empty_months())

              valences.forEach((month, i) => {
                Object.assign(all_valences[i], month)
              })
            }

            // prevent further api calls
            setLoaded(true)
            // const final_playlist = last_years_tracks.map(item => item.track.id)
            console.log(all_valences)
            console.log('done')
          } catch (e) {
            console.log("error", e)
            return
          }
      } else {
        console.log('not rerunning')
      }
    }
    getData()
    console.log(songs)
  }, [token, loaded, songs])

  return (
    <div>
      <h1>Visualization</h1>
    </div>
  );
}

export default Visualization;