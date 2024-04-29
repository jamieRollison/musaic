import { useMemo } from "react";
import PropTypes from "prop-types";
import MoodStringGenerator from "../../util/moodgen";
import { Tooltip } from "react-tooltip";

export default function Mood({ month, data, dataIdx}) {
  const reverseMonthMap = useMemo(() => {
    return {
      0: "Year",
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December",
    };
  }, []);

  const colors = [
    "#55c667ff",
    "#39568cff",
    "#287d8eff",
    "#b8de29ff",
    "#481567ff",
  ];

  const recoverMeaning = (mood) => {
    // best code to ever be written
    if (mood === "Sad") {
      return "low Valence";
    } else if (mood === "Content") {
      return "medium Valence";
    } else if (mood === "Happy") {
      return "high Valence";
    } else if (mood === "Calm") {
      return "low Energy";
    } else if (mood === "Excited") {
      return "medium Energy";
    } else if (mood === "Lively") {
      return "high Energy";
    } else if (mood === "Relaxing") {
      return "low Danceability";
    } else if (mood === "Fun") {
      return "medium Danceability";
    } else if (mood === "Dance Party") {
      return "high Danceability";
    } else if (mood === "Electronic") {
      return "low Acousticness";
    } else if (mood === "Homely") {
      return "medium Acousticness";
    } else if (mood === "Natural") {
      return "high Acousticness";
    } else if (mood === "Mellow") {
      return "low Tempo";
    } else if (mood === "Groovy") {
      return "medium Tempo";
    } else if (mood === "Upbeat") {
      return "high Tempo";
    }
  };

  const total = useMemo(() => {
    const sum = data.reduce(
      (acc, month) => {
        acc.valence += month.valence;
        acc.energy += month.energy;
        acc.acousticness += month.acousticness;
        acc.danceability += month.danceability;
        acc.tempo += month.tempo;
        acc.speechiness += month.speechiness;
        return acc;
      },
      {
        valence: 0,
        energy: 0,
        danceability: 0,
        tempo: 0,
        speechiness: 0,
        acousticness: 0,
      }
    );
    return {
      valence: sum.valence / data.length,
      energy: sum.energy / data.length,
      acousticness: sum.acousticness / data.length,
      danceability: sum.danceability / data.length,
      tempo: sum.tempo / data.length,
      speechiness: sum.speechiness / data.length,
    };
  }, [data]);

  const moodsStrings = useMemo(() => {
    console.log([total, ...data].map((month) => 
                MoodStringGenerator(month, dataIdx)));
    return [total, ...data].map((month) => 
                MoodStringGenerator(month, dataIdx));
  }, [data, total, dataIdx]);

  return (
    <div className="item-most items-center h-fit justify-between">
      <h1>You had a</h1>
      {moodsStrings[month].map((mood, idx) => (
        <div key={idx}>
          <h2
            data-tooltip-id={mood}
            style={{ color: colors[idx] }}
            className="font-bold text-5xl"
          >
            {mood}
          </h2>
          <Tooltip
            id={mood}
            effect="solid"
            style={{
              backgroundColor: colors[idx],
              borderRadius: "10px",
            }}
          >
            {mood} indicates {recoverMeaning(mood)}
          </Tooltip>
        </div>
      ))}
      <h1>{reverseMonthMap[month]}</h1>
    </div>
  );
}

Mood.propTypes = {
  month: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  dataIdx: PropTypes.number.isRequired,
};
