import art_map from "../../routes/Visualization/data/album_art.json";
import top_songs from "../../routes/Visualization/data/top_songs.json";
import bottom_songs from "../../routes/Visualization/data/bottom_songs.json";

import PropTypes from "prop-types";

export default function Representatives({ lens, dataIdx, month }) {
  return (
    <div className="item-most">
      <h3>Songs with highest {lens}</h3>
      <div className="image-row">
        {top_songs[dataIdx][month][lens].map((item, i) => {
          const id = item["spotify_track_uri"];
          return (
            <div key={i} className="image-container">
              <img src={art_map[id]} alt={"album art"} className="album" />
              <p className="font-primary h-full" style={{ fontSize: "1.3rem" }}>
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
  );
}

Representatives.propTypes = {
  lens: PropTypes.string.isRequired,
  dataIdx: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  top_songs: PropTypes.array.isRequired,
  bottom_songs: PropTypes.array.isRequired,
};
