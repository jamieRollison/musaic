import tertileData from "../../mood_labeling/tertiles.json"
// import PropTypes from "prop-types";

export default function MoodStringGenerator(monthProps, dataIdx) {
  dataIdx = 2; // 2 for the super_set, 0 = jamie, 1 = melanie
  const tertiles = tertileData[dataIdx];
  const tertile_labels = {
    valence: {
      lo: "Sad",
      me: "Content",
      hi: "Happy",
    },
    energy: {
      lo: "Calm",
      me: "Excited",
      hi: "Lively",
    },
    danceability: {
      lo: "Relaxing",
      me: "Fun",
      hi: "Dance Party",
    },
    acousticness: {
      lo: "Electronic",
      me: "Homely",
      hi: "Natural",
    },
    tempo: {
      lo: "Mellow",
      me: "Groovy",
      hi: "Upbeat",
    },
  };
  function intersect_keys(o1, o2) {
    const [k1, k2] = [Object.keys(o1), Object.keys(o2)];
    const [first, next] = k1.length > k2.length ? [k2, o1] : [k1, o2];
    return first.filter((k) => k in next);
  }

  const found_features = intersect_keys(monthProps, tertiles);
  // const total = found_features.length;
  return found_features.reduce((rv, feature) => {
    const [thres1, thres2] = tertiles[feature];
    const monthVal = monthProps[feature];
    if (monthVal < thres1) {
      return [...rv, tertile_labels[feature].lo];
    } else if (thres1 <= monthVal && monthVal < thres2) {
      return [...rv, tertile_labels[feature].me];
    } else {
      return [...rv, tertile_labels[feature].hi];
    }
  }, []);
}

// MoodStringGenerator.propTypes = {
//   monthProps: PropTypes.object.isRequired,
//   dataIdx: PropTypes.number.isRequired,
// };