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
                if ((file_item["skipped"] == False) and (datetime.fromisoformat(file_item["ts"]).year == year) and (file_item["spotify_track_uri"] != None))
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

# Load environment variables from .env file
load_dotenv()

# Access environment variables
my_client_id = os.getenv('VITE_ID')
my_client_secret = os.getenv('VITE_SECRET')

client_credentials_manager = SpotifyClientCredentials(client_id=my_client_id,
                                                      client_secret=my_client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

cleaned_df = data_pd.drop_duplicates(subset=['spotify_track_uri'])

for index, row in cleaned_df.iterrows():
    split = row["spotify_track_uri"].split(":")
    spotify_uri = split[2]
    
    try:
        # more info about audio features: https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
        track_info = sp.audio_features([spotify_uri])
        song_features = track_info[0]

        cleaned_df.loc[index, 'valence'] = song_features["valence"]
        cleaned_df.loc[index, 'energy'] = song_features["energy"]
        cleaned_df.loc[index, 'danceability'] = song_features["danceability"]
        cleaned_df.loc[index, 'acousticness'] = song_features["acousticness"]
        cleaned_df.loc[index, 'tempo'] = song_features["tempo"]
        cleaned_df.loc[index, 'speechiness'] = song_features["speechiness"]
        cleaned_df.loc[index, 'mode'] = song_features["mode"]

        print(cleaned_df.loc[index])
    except spotipy.SpotifyException as e:
        # Rate limiting error
        if e.http_status == 429:
            print("Rate limited.")
            print(e)
            break

# for index, row in data_pd.iterrows():
#     date = datetime.fromisoformat(row["ts"])
#     year = date.year
#     month = date.month
#     day = date.day

#     data_pd.loc[index, 'year'] = year
#     data_pd.loc[index, 'month'] = month
#     data_pd.loc[index, 'day'] = day

#     split = row["spotify_track_uri"].split(":")
#     spotify_uri = split[2]

# print("resume_index:", resume_index)
# sorted_df = data_pd.sort_values(by=['month', 'day'])
# # Write DataFrame to JSON file
# # sorted_df.to_json('data.json', orient='records', lines=True)
# sorted_df.to_json('data.json', orient = 'split', compression = 'infer', index = 'true')

# sorted_df = cleaned_df.sort_values(by=['month', 'day'])
# Write DataFrame to JSON file
# sorted_df.to_json('data.json', orient='records', lines=True)

# wrote song data to data.json
# cleaned_df.to_json('data.json', orient = 'split', compression = 'infer', index = 'true')
