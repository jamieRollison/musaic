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

export default function VisLineGraph({ data, setMonth }) {
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
  const formatMonth = (date) => {
    return date
      .split(":")
      .map((d) => {
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

  return (
    <div className="div-lgraph">
      <h3 className="text-2xl font-bold">Select Track Audio Features</h3>
      <div>
        <div className="flex justify-between items-center">
          {features.map((feature, idx) => {
            return (
              <div
                key={idx}
                className="font-primary font-md flex flex-row text-center space-x-2"
              >
                <input
                  type="checkbox"
                  id={feature}
                  name={feature}
                  checked={active_features.includes(feature)}
                  className={`appearance-none h-5 self-center w-5 border border-black rounded-md checked:border-transparent checked:text-black checked:font-bold checked:font-primary`}
                  style={
                    active_features.includes(feature)
                      ? { backgroundColor: feature_color_map[feature] }
                      : { border: `2px solid ${feature_color_map[feature]}` }
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFeatures([...active_features, feature]);
                    } else {
                      setFeatures(active_features.filter((g) => g !== feature));
                    }
                  }}
                />
                <label
                  className="flex items-center justify-between"
                  htmlFor={feature}
                >
                  {feature_name_map[feature]}
                  {/* <div className={` h-5 w-5 border border-black mx-1`} /> */}
                </label>
              </div>
            );
          })}
          <div className="space-x-3">
            <button
              className="border-2 border-black rounded-md hover:bg-gray-200 p-1 text-xl"
              onClick={() => setFeatures(features)}
            >
              Select All
            </button>
            <button
              className="border-2 border-black rounded-md hover:bg-gray-200 p-1 text-xl"
              onClick={() => setFeatures([])}
            >
              Deselect All
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center w-4/5">
          {["Full Year", ...monthNames].map((month, idx) => {
            return (
              <button
                key={idx}
                className="border-2 border-black rounded-md hover:bg-gray-200 p-1 text-xl"
                onClick={() => {
                  setMonth(idx);
                }}
              >
                {month}
              </button>
            );
          })}
        </div>
      </div>
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
              tickFormatter={(date) => {
                return date.split(":")[0];
              }}
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
    </div>
  );
}

VisLineGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  setMonth: PropTypes.func.isRequired,
};
