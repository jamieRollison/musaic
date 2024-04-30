import musaicLogo from "/musaic-logo.svg";
import { Link } from "react-router-dom";
import spotifyLogo from "/spotify-logo.svg";

function Root() {
  // const base = import.meta.env.PROD
  //   ? "https://musaic-psi.vercel.app"
  //   : "http://localhost:5173";
  // function generateRandomString(length) {
  //   const chars =
  //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //   let randomString = "";
  //   for (let i = 0; i < length; i++) {
  //     randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return randomString;
  // }

  // const REDIRECT_URI = `${base}/login`;
  // const SCOPES = "user-read-private user-read-email user-read-recently-played";
  // const state = generateRandomString(16);

  // const spotify_params = useSearchParams({
  //   response_type: "code",
  //   client_id: import.meta.env.VITE_OTHER_ID,
  //   scope: SCOPES,
  //   redirect_uri: REDIRECT_URI,
  //   state: state,
  // });
  // console.log(spotify_params.toString());

  // useEffect(() => {
  //   // async function fetchRecentlyPlayedTracks(accessToken) {
  //   //   console.log("accessToken: ", accessToken);
  //   //   try {
  //   //     const { data } = await axios({
  //   //       method: "get",
  //   //       url: "https://api.spotify.com/v1/me/player/recently-played",
  //   //       headers: {
  //   //         Authorization: "Bearer " + accessToken,
  //   //       },
  //   //       params: {
  //   //         // limits the number of tracks to 10, this should be changed
  //   //         limit: 10,
  //   //       },
  //   //     });

  //   //     // Extract and return the list of recently played tracks
  //   //     return data.items;
  //   //   } catch (error) {
  //   //     console.error("Error fetching recently played tracks:", error.message);
  //   //     throw error;
  //   //   }
  //   // }

  //   // const token = window.localStorage.getItem("token");
  //   // if (token) fetchRecentlyPlayedTracks(token);
  // });

  // const spotify_url =
  //   "https://accounts.spotify.com/authorize?" +
  //   spotify_params.toString().split(",")[0];

  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center space-y-6">
      <img src={musaicLogo} style={{ height: 165 }} />
      <p className="font-secondary">
        Your
        <span style={{ fontWeight: 550, color: "#2D81FF" }}> story </span>
        through your
        <span style={{ fontWeight: 550, color: "#FF3D77" }}> tunes</span>.
      </p>
      <Link to="/visualization">
        <button className="flex items-center bg-valence rounded-[2em] p-3 space-x-3">
          <img src={spotifyLogo} className="h-8" />
          <p className="text-sm font-default font-bold">
            Upload your Spotify Data
          </p>
        </button>
      </Link>
      <div className="w-screen absolute bottom-0 left-0 p-5">
        <p className="text-center font-other text-s text-gray-800">
          Data is processed in browser, and is not stored or otherwise used.
        </p>
        <p className="text-center font-other text-[12pt] text-gray-800">
          Musaic shows you the emotional journey of your music listening habits.
          It may cause you to reflect on your past experiences, and may bring up
          negative memories or emotions.
        </p>
      </div>
    </div>
  );
}

export default Root;
