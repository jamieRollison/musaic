// import * as data_module from "/yearly_trends/daily_average_attributes.json";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";
// import { json } from 'd3'
import { useState } from "react";
import PropTypes from "prop-types";

export default function VisLineGraph({ data }) {
  console.log(data);

  const formatMonth = (date) => {
    const monthNames = [
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
    return date
      .split(":")
      .map((d) => {
        console.log(d);
        const [month, day] = d.split("-");
        return `${monthNames[parseInt(month) - 1]} ${day}`;
      })
      .join(" to ");
  };

  const features = [
    "valence",
    "danceability",
    "energy",
    "acousticness",
    "tempo",
    "speechiness",
  ];
  const [active_features, setFeatures] = useState(features);
  const feature_name_map = {
    valence: "Valence",
    danceability: "Danceability",
    energy: "Energy",
    acousticness: "Acousticness",
    tempo: "Tempo",
    speechiness: "Speechiness",
  };
  const feature_color_map = {
    valence: "#55c667ff",
    danceability: "#39568cff",
    energy: "#287d8eff",
    acousticness: "#b8de29ff",
    tempo: "#481567ff",
    speechiness: "#fde725ff",
  };
  const feature_yaxis_map = {
    valence: "left",
    danceability: "left",
    energy: "left",
    acousticness: "left",
    tempo: "right",
    speechiness: "left",
  };
  const transformedData = Object.entries(data).map(([date, attributes]) => ({
    date, // x-axis
    ...attributes, // y-axis attributes
  }));

  return (
    <div className="div-lgraph">
      <div className="linegraph">
        <h1 className="font-secondary">{`Song Audio Features Over Time`}</h1>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 0, right: 50, left: 50, bottom: 40 }}
          >
            {/* <Legend style={{ marginTop: 50 }} wrapperStyle={{paddingTop: 20}}/> */}
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <YAxis yAxisId="left" className="linegraph-tick-labels">
              <Label
                angle={-90}
                value="Units"
                position="insideLeft"
                offset={-10}
                className="linegraph-labels"
              />
            </YAxis>
            <YAxis
              yAxisId="right"
              orientation="right"
              className="linegraph-tick-labels"
            >
              <Label
                angle={90}
                value="Beats per Minute (BPM)"
                offset={-20}
                position="insideRight"
                className="linegraph-labels"
              />
            </YAxis>
            <XAxis
              interval={28}
              dataKey="date"
              className="linegraph-tick-labels"
            >
              <Label
                value="Date"
                offset={-30}
                position="insideBottom"
                className="linegraph-labels"
              />
            </XAxis>
            <Tooltip
              labelFormatter={formatMonth}
              formatter={(value, name) => {
                return [`${feature_name_map[name]}: ${value.toPrecision(4)}`];
              }}
            />
            {active_features.map((feature, index) => {
              return (
                <Line
                  yAxisId={feature_yaxis_map[feature]}
                  key={index}
                  type="monotone"
                  dataKey={feature}
                  stroke={feature_color_map[feature]}
                  strokeWidth={2.5}
                  dot={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
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
      </div>
    </div>
  );
}

VisLineGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};
