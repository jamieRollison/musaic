const express = require('express');
const querystring = require('querystring');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:8888/callback';
const SCOPES = 'user-read-private user-read-email user-read-recently-played';

// MS: this is an example that I was using to test that we can actually access the recently played tracks
async function fetchRecentlyPlayedTracks(accessToken) {
  console.log("accessToken: ", accessToken);
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      params: {
        // limits the number of tracks to 10, this should be changed
        limit: 10
      }
    });

    // Extract and return the list of recently played tracks
    return response.data.items;
  } catch (error) {
    console.error('Error fetching recently played tracks:', error.message);
    throw error;
  }
}

app.get('/login', (req, res) => {
  const state = generateRandomString(16);

  // Construct authorization URL
  const authorizationUrl = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      state: state
    });

  // Redirect user to authorization URL
  res.redirect(authorizationUrl);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // TODO: redirect the user to wherever we send them after they log in
    res.redirect(`http://localhost:5173/`);
    const accessToken = data.access_token;

    // TODO: do something with the recently played tracks
    fetchRecentlyPlayedTracks(accessToken)
    .then(recentlyPlayedTracks => {
      console.log('Recently played tracks:');
      recentlyPlayedTracks.forEach((track, index) => {
        console.log(`${index + 1}. ${track.track.name} by ${track.track.artists[0].name}`);
      });
    })
    .catch(error => {
      console.error('Failed to fetch recently played tracks:', error);
    });

  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Helper function to generate random string
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomString;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
