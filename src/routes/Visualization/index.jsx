import Navbar from '../../components/navbar/navbar'
import Dial from '../../components/dial/dial'
import {useEffect, useState, useCallback} from 'react'
import axios from 'axios'
import { all_songs, ids_map, averages } from "./offline"
import { colors } from './offline'
import * as data_module from "/yearly_trends/daily_average_attributes.json";
import { date_map } from './dailydata';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Label,
} from "recharts";
import { json } from 'd3'

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


  const features = [
    "valence_avg",
    "danceability_avg",
    "energy_avg",
    "acousticness_avg",
    "tempo_avg",
    "speechiness_avg",
  ];

  const [active_features, setFeatures] = useState(features);
  const handleFeatureChange = (attribute) => {
    if (active_features.includes(attribute)) {
        setFeatures(active_features.filter(attr => attr !== attribute));
    } else {
        setFeatures([...active_features, attribute]);
    }
  };
  const feature_name_map = {
    valence_avg: "Valence",
    danceability_avg: "Danceability",
    energy_avg: "Energy",
    acousticness_avg: "Acousticness",
    tempo_avg: "Tempo",
    speechiness_avg: "Speechiness",
  };
  const feature_color_map = {
    valence_avg: "#55c667ff",
    danceability_avg: "#39568cff",
    energy_avg: "#287d8eff",
    acousticness_avg: "#b8de29ff",
    tempo_avg: "#481567ff",
    speechiness_avg: "#fde725ff",
  };
  const transformedData = Object.entries(date_map).map(([date, attributes]) => ({
    date, // x-axis
    ...attributes, // y-axis attributes
  }));  

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
                  <img src={ids_map[id].image.url} alt={ids_map[id].name} className='album'/>
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


        <div className="flex justify-between pr-10">
          <div>
            <h1 className="text-xl font-bold">
              {`Song Audio Features Over Time`}
            </h1>  
            <LineChart
              width={1500}
              height={700}
              data={transformedData}
              margin={{ top: 15, right: 20, left: 20, bottom: 20 }}
            >
              <Legend style={{ marginTop: 50 }} wrapperStyle={{paddingTop: 20}}/>
              <CartesianGrid strokeDasharray="3 3" stroke = "#ccc"/>
              <YAxis>
                <Label
                  // value={
                  //   // overviewCategory === ""
                  // }
                  angle={-90}
                  position="insideLeft"
                />
              </YAxis>
              <XAxis dataKey = "date">
                <Label
                  value="Date"
                  fontSize={30}
                  offset={-15}
                  position="insideBottom"
                />
              </XAxis>
              <Tooltip />
              {active_features.map((feature, index) => {
                return (
                    <Line 
                      key={index} 
                      type="monotone" 
                      dataKey={feature} 
                      stroke={feature_color_map[feature]} 
                      strokeWidth={2.5}
                      activeDot={{ r: 6 }}
                      />
                );
              })}

            </LineChart>
            
            <div>
              <h3 className="text-xl font-bold">Select Track Audio Features</h3>
                  {features.map((feature, idx) => {
                  return (
                    <div key={idx} style={{ marginBottom: "10px" }}>
                      <input
                        type="checkbox"
                        id={feature}
                        name={feature}
                        checked={active_features.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFeatures([...active_features, feature]);
                          } else {
                            setFeatures(active_features.filter((g) => g !== feature));
                          }
                        }}
                      />
                      <label htmlFor={feature} style={{ marginLeft: "5px" }}>
                        {feature_name_map[feature]}
                      </label>
                    </div>
                  );
                })}
                <div className="space-x-3">
                  <button
                    className="border-2 border-black rounded-md hover:background-gray-200 p-1"
                    onClick={() => setFeatures(features)}
                  >
                    Select All
                  </button>
                  <button
                    className="border-2 border-black rounded-md hover:background-gray-200 p-1"
                    onClick={() => setFeatures([])}
                  >
                    Deselect All
                  </button>
                </div>

                {/* <label style={{ color: feature_color_map['valence'] }}>
                    <input type="checkbox" value="valence_avg" onChange={() => handleFeatureChange("valence_avg")} checked={true} />
                    Valence Average
                </label>
                <label style={{ color: feature_color_map['danceability'] }}>
                    <input type="checkbox" value="danceability_avg" onChange={() => handleFeatureChange("danceability_avg")} />
                    Danceability Average
                </label>
                <label style={{ color: feature_color_map['energy'] }}>
                    <input type="checkbox" value="energy_avg" onChange={() => handleFeatureChange("energy_avg")} />
                    Energy Average
                </label>
                <label style={{ color: feature_color_map['acousticness'] }}>
                    <input type="checkbox" value="acousticness_avg" onChange={() => handleFeatureChange("acousticness_avg")} />
                    Acousticness Average
                </label>
                <label style={{ color: feature_color_map['tempo'] }}>
                    <input type="checkbox" value="tempo_avg" onChange={() => handleFeatureChange("tempo_avg")} />
                    Tempo Average
                </label>
                <label style={{ color: feature_color_map['speechiness'] }}>
                    <input type="checkbox" value="speechiness_avg" onChange={() => handleFeatureChange("speechiness_avg")} />
                    Speechiness Average
                </label> */}      
            </div>
          </div>
        </div>      


        </div>
      </div>
    </>) : (
      <div>
        <h1 className='font-primary'>Getting your data from spotify...</h1>
      </div>
    )
  )
}

export default Visualization