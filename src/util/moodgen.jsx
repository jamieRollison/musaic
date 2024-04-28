export default function MoodStringGenerator(monthProps) {
  const tertiles = {
    valence: [0.329, 0.606],
    energy: [0.551, 0.8],
    danceability: [0.5026666666666569, 0.655],
    acousticness: [0.0451, 0.429],
    tempo: [106.64166666666662, 132.67499999999995],
    // 'speechiness': [0.0394, 0.067],
    // 'mode': [0.0, 1.0],
  };

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
    // 'speechiness': {
    //   'lo': 'Instrumental',
    //   'me': 'Vocal',
    //   'hi': 'Talkative',
    // },
    // 'mode': {
    //   'lo': ,
    //   'hi': ,
    // }
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
