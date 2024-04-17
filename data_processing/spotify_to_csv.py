import os
import json
from datetime import timedelta, datetime
from sys import argv
import pandas as pd

if len(argv) < 4:
    print("usage: python spotify_to_csv.py [input directory] [output file] [year]")
    exit(1)

directory = argv[1]
output_file = argv[2]
year = argv[3]

# current_date = datetime.today()
# one_year_ago = current_date - timedelta(days=365)

# print(f"Getting data between {one_year_ago} and {current_date}")

# Get all the JSON files in the directory
json_files = [
    file for file in os.listdir(directory) if file.endswith(".json") and (year in file)
]
print("Found relevant files:", json_files)

# Initialize an empty list to store the data
data = []

# Iterate over each JSON file
for file in json_files:
    file_path = os.path.join(directory, file)
    with open(file_path, "r") as f:
        # Load the JSON data from the file
        file_data = json.load(f)
        # Append the data to the list
        data.extend(
            [
                file
                for file in file_data
                if datetime.fromisoformat(file["ts"]).year == int(year)
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

# Write the concatenated data to the output file
# with open(output_file, "w") as f:
#     data_pd.to_csv(output_file)
