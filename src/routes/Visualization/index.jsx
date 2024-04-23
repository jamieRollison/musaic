import Navbar from '../../components/navbar/navbar'
import Dial from '../../components/dial/dial'
import {useEffect, useState, useCallback} from 'react'
import axios from 'axios'
import { all_songs, ids_map, averages } from "./offline"
import { colors } from './offline'
import VisLineGraph from '../../components/linegraph/linegraph'

function Visualization() {
  const token = window.localStorage.getItem('token')
  const [loaded, setLoaded] = useState(true)
  const [lens, setLens] = useState("valence")
  // const [songs, setSongs] = useState([])
  // const [id_map, setIdMap] = useState({})
  // const [averages, setAverages] = useState([0,0,0,0,0,0,0,0,0,0,0,0])

  
  // get the top 3 most valent songs per month
  const stats = (month, quality, top) => {
    let month_songs = {}
    if (month === 0) {
      // get full year
      month_songs = all_songs.reduce((acc, month) => Object.assign(acc, month), {})
    } else {
      month_songs = all_songs[month-1]
    }
    const sorted = Object.keys(month_songs).sort((a, b) => (top ? 1 : -1) * (month_songs[b][quality] - month_songs[a][quality]))
    return sorted.slice(0, 3).map(id => [id, month_songs[id][quality]])
  }


  const playlist_id = '4EK2TDhIoZSGtoOU71zvpn'
  useEffect(() => {
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
                acc[item.track.id] = {name: item.track.name, artists: item.track.artists.map(artist => artist.name).join(', '), genres: item.track.artists.map(artist => artist.genres).join(', '), image: item.track.album.images[0]}
                return acc
              }, acc)
            , {})
            console.log(id_song_map)
            // setIdMap(id_song_map)

            const id_added_map = last_years_tracks.reduce((acc, sublist) =>
              sublist.reduce((acc, item) => {
                acc[item.track.id] = item.added_at
                return acc
              }, acc)
            , {})

            // get valence info on each track (also 100 at a time) and store it by month
            const empty_months = () => [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

            let all_songs = empty_months()
            for (let sublist of ids) {
              let url = `https://api.spotify.com/v1/audio-features?ids=${sublist.join(',')}`
              const {data} = await axios({
                method: 'get',
                url: url,
                headers: {
                  'Authorization': 'Bearer ' + token
                },
              });
              const song_info = data.audio_features.reduce((acc, item) => {
                const month = parseInt(id_added_map[item.id].split('-')[1]) - 1
                acc[month][item.id] = {valence: item.valence, energy: item.energy, danceability: item.danceability}
                return acc
              }, empty_months())

              song_info.forEach((month, i) => {
                Object.assign(all_songs[i], month)
              })
            }

            // prevent further api calls
            setLoaded(true)
            // const final_playlist = last_years_tracks.map(item => item.track.id)
            console.log(all_songs)
            // setSongs(all_songs)
            const averages = all_songs.map((month) => {
              const valenceSum = Object.values(month).reduce((sum, song) => sum + song.valence, 0);
              const danceabilitySum = Object.values(month).reduce((sum, song) => sum + song.danceability, 0);
              const energySum = Object.values(month).reduce((sum, song) => sum + song.energy, 0);
              const count = Object.keys(month).length;
              console.log(count)
              return {
                valence: valenceSum / count,
                danceability: danceabilitySum / count,
                energy: energySum / count,
              };
            });

            console.log(averages);
            // setAverages(averages)
            console.log('done')
          } catch (e) {
            console.log("error", e)
            return
          }
        }
    }
    if (token && !loaded) {
      // getData()
    } else {
      console.log('not rerunning')
    }
  }, [token, loaded])

  const monthValues = [
    "Click on a month!",
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December", 
  ]
  const [month, setMonth] = useState(0)
  const handleMonth = useCallback(
    (nextMonth) => {
      if (! (1 <= nextMonth && nextMonth <= 12)) { return }
      setMonth(nextMonth)
    }
  , [])



  return (
    loaded ?
    (<>
      <Navbar />
      <div className='vis-grid'>
        <h3 className='font-primary item-year'>2023</h3>
        <h3 className='font-primary item-month'>{monthValues[month]}</h3>
        <div className='item-dial'>
          <div className='lens-buttons'>
            <button style={{color: lens === 'valence' ? 'white' : 'black'}} onClick={() => setLens("valence")}>Valence</button>
            <button style={{color: lens === 'energy' ? 'white' : 'black'}} onClick={() => setLens("energy")}>Energy</button>
            <button style={{color: lens === 'danceability' ? 'white' : 'black'}} onClick={() => setLens("danceability")}>Danceability</button>
          </div>
          <div className='legend'>
            <p>less {lens}</p>
            <div style={{background: `linear-gradient(90deg, ${colors})`}}></div>
            <p>more {lens}</p>
          </div>
          <Dial data={averages} changeMonth={handleMonth} lens={lens}/>
        </div>
        <div className='item-most'>
          {/* TODO: Update top artists/songs based on month selected */}
          <h3>Songs with highest {lens}</h3>
          <div className='image-row'>
            {stats(month, lens, true).map((item, i) => {
              const [id, quality] = item
              return (
                <div key={i} className='image-container'>
                  <img src={ids_map[id].image.url} alt={ids_map[id].name}
                   className='album'/>
                  <p>{ids_map[id].name}</p>
                  <p>{`${lens}: ${quality}`}</p>
                </div>
              )})
            }
          </div>
          <h3>Songs with lowest {lens}</h3>
          <div className='image-row'>
            {stats(month, lens, false).map((item, i) => {
              const [id, quality] = item
              return (
                <div key={i} className='image-container'>
                  <img src={ids_map[id].image.url} alt={ids_map[id].name} className='album'/>
                  <p>{ids_map[id].name}</p>
                  <p>{`${lens}: ${quality}`}</p>
                </div>
              )})
            }
          </div>
        </div>
      </div>
      <VisLineGraph/>
    </>) : (
      <div>
        <h1 className='font-primary'>Getting your data from spotify...</h1>
      </div>
    )
  )
}

export default Visualization