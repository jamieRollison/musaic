import Navbar from "../../components/navbar/navbar";
import Dial from "../../components/dial/dial";
import { useState, useCallback, useMemo } from "react";
import VisLineGraph from "../../components/linegraph/linegraph";
import monthlyData from "./data/monthly_averages.json";
import top_songs from "./data/top_songs.json";
import bottom_songs from "./data/bottom_songs.json";
import rollingData from "./data/rolling_avg.json";
import Representatives from "../../components/reprentatives";
import ViewSwitcher from "../../components/viewswitcher";
import Mood from "../../components/mood";

function Visualization() {
  const [lens, setLens] = useState("valence");
  const [dataIdx, setDataIdx] = useState(0);
  const [showTop, setShowTop] = useState(true);

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
    if (!(nextMonth <= 12)) {
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

  return (
    <>
      <Navbar setData={setDataIdx} />
      <div className="vis-grid">
        <h3 className="font-primary item-year">2023</h3>
        <h3 className="font-primary item-month">{monthValues[month]}</h3>
        <div className="item-dial">
          <Dial
            data={monthlyData[dataIdx]}
            month={month}
            changeMonth={handleMonth}
            lens={lens}
            setLens={setLens}
          />
        </div>
        <ViewSwitcher view={showTop} setView={setShowTop} />
        {showTop ? (
          <Representatives
            lens={lens}
            dataIdx={dataIdx}
            month={month}
            top_songs={top_songs}
            bottom_songs={bottom_songs}
          />
        ) : (
          <Mood month={month} data={monthlyData[dataIdx]} />
        )}
        <VisLineGraph
          data={
            month === 0
              ? rollingData[dataIdx]
              : rollingData[dataIdx].slice(
                  monthCutoff[month - 1],
                  monthCutoff[month]
                )
          }
          setMonth={handleMonth}
        />
      </div>
    </>
  );
}

export default Visualization;
