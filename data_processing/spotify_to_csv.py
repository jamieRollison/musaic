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
                if (
                    (file_item["skipped"] == False)
                    and (datetime.fromisoformat(file_item["ts"]).year == year)
                    and (file_item["spotify_track_uri"] != None)
                )
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
    ]
]

# read data from data.json for information about audio features for every unique song
file_path = "data6.json"
song_features = pd.read_json(file_path, orient="split", compression="infer")

# loop through data_pd and add audio features to the dataframe
for index, row in data_pd.iterrows():
    date = datetime.fromisoformat(row["ts"])
    data_pd.loc[index, "year"] = date.year
    data_pd.loc[index, "month"] = date.month
    data_pd.loc[index, "day"] = date.day

    # get the song uri
    spotify_uri = row["spotify_track_uri"]

    # get the audio features for the song
    filtered_df = song_features[song_features["spotify_track_uri"] == spotify_uri]
    if filtered_df.empty:
        print("No song features found for ", row["master_metadata_track_name"])
        continue

    song_info = filtered_df.iloc[0]

    # add the audio features to the dataframe
    data_pd.loc[index, "valence"] = song_info["valence"]
    data_pd.loc[index, "energy"] = song_info["energy"]
    data_pd.loc[index, "danceability"] = song_info["danceability"]
    data_pd.loc[index, "acousticness"] = song_info["acousticness"]
    data_pd.loc[index, "tempo"] = song_info["tempo"]
    data_pd.loc[index, "speechiness"] = song_info["speechiness"]
    data_pd.loc[index, "mode"] = song_info["mode"]

# sort the dataframe by month and day
data_pd1 = data_pd.dropna()
sorted_df = data_pd1.sort_values(by=["month", "day"])

# write the dataframe to final_data.json
sorted_df.to_json("final_data2.json", orient="split", compression="infer", index="true")


####################
# Below code is for getting audio features from Spotify API
####################

# # Load environment variables from .env file
# load_dotenv()

# # Access environment variables
# my_client_id = os.getenv('VITE_OTHER_ID')
# my_client_secret = os.getenv('VITE_OTHER_SECRET')

# client_credentials_manager = SpotifyClientCredentials(client_id=my_client_id,
#                                                       client_secret=my_client_secret)
# sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

# cleaned_df = data_pd.drop_duplicates(subset=['spotify_track_uri'])
# resume_index = 18537

# for index, row in cleaned_df.iterrows():
#     split = row["spotify_track_uri"].split(":")
#     spotify_uri = split[2]

#     if (index < resume_index):
#         continue

#     try:
#         # more info about audio features: https://developer.spotify.com/documentation/web-api/reference/get-audio-features
#         track_info = sp.audio_features([spotify_uri])
#         song_features = track_info[0]

#         if (song_features == None):
#             print("No song features found for ", row["master_metadata_track_name"])
#             continue
#         else:
#             cleaned_df.loc[index, 'valence'] = song_features["valence"]
#             cleaned_df.loc[index, 'energy'] = song_features["energy"]
#             cleaned_df.loc[index, 'danceability'] = song_features["danceability"]
#             cleaned_df.loc[index, 'acousticness'] = song_features["acousticness"]
#             cleaned_df.loc[index, 'tempo'] = song_features["tempo"]
#             cleaned_df.loc[index, 'speechiness'] = song_features["speechiness"]
#             cleaned_df.loc[index, 'mode'] = song_features["mode"]

#         print(cleaned_df.loc[index])
#     except spotipy.SpotifyException as e:
#         # Rate limiting error
#         if e.http_status == 429:
#             print("Rate limited.")
#             print(e)
#             resume_index = index
#             break

# # Combine prev_song_data and cleaned_df
# prev_song_data = pd.read_json("data4.json", orient="split", compression="infer")
# prev_song_data1 = prev_song_data.dropna()

# cleaned_df.to_json("data5.json", orient="split", compression="infer", index="true")
# cleaned_df1 = cleaned_df.dropna()
# cleaned_df_total = pd.concat([prev_song_data1, cleaned_df1], ignore_index=True)

# # wrote song data to data6.json
# print("resume index: ", resume_index)
# cleaned_df_total.to_json("data6.json", orient="split", compression="infer", index="true")
