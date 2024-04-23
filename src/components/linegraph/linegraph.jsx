// import * as data_module from "/yearly_trends/daily_average_attributes.json";
import { date_map } from '../../routes/Visualization/dailydata';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Label,
  ResponsiveContainer
} from "recharts";
// import { json } from 'd3'
import { useState } from "react";

export default function VisLineGraph() {
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
  const feature_yaxis_map = {
    valence_avg: "left",
    danceability_avg: "left",
    energy_avg: "left",
    acousticness_avg: "left",
    tempo_avg: "right",
    speechiness_avg: "left",
  };
  const transformedData = Object.entries(date_map).map(([date, attributes]) => ({
    date, // x-axis
    ...attributes, // y-axis attributes
  }));  

  return (
    <div className='div-lgraph'>
      <div className="linegraph">
        <h1 className="font-secondary">
          {`Song Audio Features Over Time`}
        </h1>  
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={transformedData}
            margin={{ top: 0, right: 50, left: 50, bottom: 40}}
          >
            {/* <Legend style={{ marginTop: 50 }} wrapperStyle={{paddingTop: 20}}/> */}
            <CartesianGrid strokeDasharray="3 3" stroke = "#ccc"/>
            <YAxis yAxisId="left" className="linegraph-tick-labels">
              <Label
                angle={-90}
                value="Units"
                position="insideLeft"
                offset={-10}
                className="linegraph-labels"
              />
            </YAxis>
            <YAxis yAxisId="right" orientation="right" 
              className="linegraph-tick-labels">
              <Label
                  angle={90}
                  value="Beats per Minute (BPM)"
                  offset={-20}
                  position="insideRight"
                  className="linegraph-labels"
              />
            </YAxis>
            <XAxis interval={28} dataKey="date" 
              className="linegraph-tick-labels">
              <Label
                value="Date"
                offset={-30}
                position="insideBottom"
                className="linegraph-labels"
              />
            </XAxis>
            <Tooltip />
            {active_features.map((feature, index) => {
              return (
                  <Line 
                    yAxisId={feature_yaxis_map[feature]}
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
  )
}