import Navbar from "../../components/navbar/navbar";
import Dial from "../../components/dial/dial";
import { useEffect, useState, useCallback, useMemo } from "react";
import VisLineGraph from "../../components/linegraph/linegraph";
import monthlyData from "./data/monthly_averages.json";
import top_songs from "./data/top_songs.json";
import bottom_songs from "./data/bottom_songs.json";
import art_map from "./data/album_art.json";
import rollingData from "./data/rolling_avg.json";

function Visualization() {
  const [lens, setLens] = useState("valence");
  const [dataIdx, setDataIdx] = useState(0);

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

  const monthCutoff = useMemo(() => {
    const cutoffs = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      rollingData[dataIdx].length,
    ];
    rollingData[dataIdx].forEach((d, idx) => {
      const date = d.date.split(":")[0];
      const month = parseInt(date.split("-")[0]);
      if (month > 1 && cutoffs[month - 1] === 0) {
        cutoffs[month - 1] = idx;
      }
    });
    return cutoffs;
  }, [dataIdx]);

  useEffect(() => {
    console.log(dataIdx);
    console.log(month);
    console.log(
      rollingData[dataIdx].slice(monthCutoff[month - 1], monthCutoff[month])
    );
  }, [dataIdx, month, monthCutoff]);

  return (
    <>
      <Navbar setData={setDataIdx} />
      <div className="vis-grid">
        <h3 className="font-primary item-year">2023</h3>
        <h3 className="font-primary item-month">{monthValues[month]}</h3>
        <div className="item-dial">
          <Dial
            data={monthlyData[dataIdx]}
            changeMonth={handleMonth}
            lens={lens}
            setLens={setLens}
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
      <VisLineGraph
        data={
          month === 0
            ? rollingData[dataIdx]
            : rollingData[dataIdx].slice(
                monthCutoff[month - 1],
                monthCutoff[month]
              )
        }
      />
    </>
  );
}

export default Visualization;
