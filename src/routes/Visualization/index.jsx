import Navbar from "../../components/navbar/navbar";
import Dial from "../../components/dial/dial";
import { useEffect, useState, useCallback } from "react";
import { colors } from "./data/offline";
import VisLineGraph from "../../components/linegraph/linegraph";
import { date_map } from "./data/dailydata";
import monthlyData from "./data/monthly_averages.json";
import top_songs from "./data/top_songs.json";
import bottom_songs from "./data/bottom_songs.json";
import art_map from "./data/album_art.json";

function Visualization() {
  const [lens, setLens] = useState("valence");
  const lenses = [
    "valence",
    "energy",
    "danceability",
    "acousticness",
    "tempo",
    "speechiness",
  ];
  const [dataIdx, setDataIdx] = useState(0);

  useEffect(() => {
    console.log(dataIdx);
  }, [dataIdx]);

  const monthValues = [
    "Click on a month!",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [month, setMonth] = useState(0);
  const handleMonth = useCallback((nextMonth) => {
    if (!(1 <= nextMonth && nextMonth <= 12)) {
      return;
    }
    setMonth(nextMonth);
  }, []);

  return (
    <>
      <Navbar setData={setDataIdx} />
      <div className="vis-grid">
        <h3 className="font-primary item-year">2023</h3>
        <h3 className="font-primary item-month">{monthValues[month]}</h3>
        <div className="item-dial">
          <div className="lens-buttons">
            {lenses.map((lens) => (
              <button
                key={lens}
                style={{ color: lens === lens ? "white" : "black" }}
                onClick={() => setLens(lens)}
              >
                {lens}
              </button>
            ))}
          </div>
          <div className="legend">
            <p>less {lens}</p>
            <div
              style={{ background: `linear-gradient(90deg, ${colors})` }}
            ></div>
            <p>more {lens}</p>
          </div>
          <Dial
            data={monthlyData[dataIdx]}
            changeMonth={handleMonth}
            lens={lens}
          />
        </div>
        <div className="item-most">
          <h3>Songs with highest {lens}</h3>
          <div className="image-row">
            {top_songs[dataIdx][month][lens].map((item, i) => {
              const id = item["spotify_track_uri"];
              return (
                <div key={i} className="image-container">
                  <img src={art_map[id]} alt={"album art"} className="album" />
                  <p className="font-primary" style={{ fontSize: "1.3rem" }}>
                    {item["master_metadata_track_name"]}
                  </p>
                  <p className="font-primary" style={{ fontSize: "1rem" }}>
                    {" "}
                    {`${lens}: ${item[lens].toPrecision(3)}`}
                  </p>
                </div>
              );
            })}
          </div>
          <h3>Songs with lowest {lens}</h3>
          <div className="image-row">
            {bottom_songs[dataIdx][month][lens].map((item, i) => {
              const id = item["spotify_track_uri"];
              return (
                <div key={i} className="image-container">
                  <img src={art_map[id]} alt={"album art"} className="album" />
                  <p className="font-primary" style={{ fontSize: "1.3rem" }}>
                    {item["master_metadata_track_name"]}
                  </p>
                  <p className="font-primary" style={{ fontSize: "1rem" }}>
                    {" "}
                    {`${lens}: ${item[lens].toPrecision(3)}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <VisLineGraph data={date_map[dataIdx]} />
    </>
  );
}

export default Visualization;
