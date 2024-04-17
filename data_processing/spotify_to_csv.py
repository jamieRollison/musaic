import os
import json
from datetime import timedelta, datetime
from sys import argv
import pandas as pd
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import time

if len(argv) < 4:
    print("usage: python spotify_to_csv.py [input directory] [output file] [year]")
    exit(1)

directory = argv[1]
output_file = argv[2]
year = argv[3]

# Get all the JSON files in the directory
json_files = [
    file for file in os.listdir(directory) if file.endswith(".json") and (year in file)
]
print("Found relevant files:", json_files)

# Initialize an empty list to store the data
data = []
year = int(year)

# Iterate over each JSON file
for file_name in json_files:
    file_path = os.path.join(directory, file_name)
    with open(file_path, "r") as f:
        # Load the JSON data from the file
        file_data = json.load(f)
        # Append the data to the list
        data.extend(
            [
                file_item
                for file_item in file_data
                if ((file_item["skipped"] == False) and (datetime.fromisoformat(file_item["ts"]).year == year))
            ]
        )

print("done scanning files")

data_pd = pd.DataFrame(data)[
    [
        "ts",
        "master_metadata_track_name",
        "master_metadata_album_artist_name",
        "master_metadata_album_album_name",
        "spotify_track_uri",
        "skipped",
    ]
]

data_pd.to_json(output_file, "records")

# Load environment variables from .env file
load_dotenv()

# Access environment variables
my_client_id = os.getenv('VITE_OTHER_ID')
my_client_secret = os.getenv('VITE_OTHER_SECRET')

client_credentials_manager = SpotifyClientCredentials(client_id=my_client_id,
                                                      client_secret=my_client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

rows_to_retry = []

for index, row in data_pd.iterrows():
    date = datetime.fromisoformat(row["ts"])
    year = date.year
    month = date.month
    day = date.day

    data_pd.loc[index, 'year'] = year
    data_pd.loc[index, 'month'] = month
    data_pd.loc[index, 'day'] = day

    split = row["spotify_track_uri"].split(":")
    spotify_uri = split[2]
    
    try:
        # more info about audio features: https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
        track_info = sp.audio_features([spotify_uri])
        song_features = track_info[0]

        data_pd.loc[index, 'valence'] = song_features["valence"]
        data_pd.loc[index, 'energy'] = song_features["energy"]
        data_pd.loc[index, 'danceability'] = song_features["danceability"]
        data_pd.loc[index, 'acousticness'] = song_features["acousticness"]
        data_pd.loc[index, 'tempo'] = song_features["tempo"]
        data_pd.loc[index, 'speechiness'] = song_features["speechiness"]

        print(data_pd.loc[index])
    except spotipy.SpotifyException as e:
        if e.http_status == 429:  # Rate limiting error
            print("Rate limited. Waiting for retry...")
            rows_to_retry.append(index)
            print(e)
            time.sleep(60)  # Wait for 60 seconds before retrying
            print(e)

print(rows_to_retry)
sorted_df = data_pd.sort_values(by=['month', 'day'])
# Write DataFrame to JSON file
sorted_df.to_json('data.json', orient='records', lines=True)
