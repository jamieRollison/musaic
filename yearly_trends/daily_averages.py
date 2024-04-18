import numpy as np
import json
from collections import defaultdict
import os

# A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. 
# Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), 
# while tracks with low valence sound more negative (e.g. sad, depressed, angry).

with open('/Users/anami/Documents/musaic/data_processing/final_data_records.json', 'r') as file:
    # Load the JSON data into a Python dictionary
    data = json.load(file)

# Now you can access the data as a Python dictionary
print(data)
valence_by_date = defaultdict(list)
for track in data:
    month = track['month']
    day = track['day']
    valence = track['valence']

    date_key = f"{month}-{day}"
    valence_by_date[date_key].append(valence)

average_daily_valence = {}
for day, valences in valence_by_date.items():
    average_daily_valence[day] = (sum(valences)/len(valences))

for day, average_valence in average_daily_valence.items():
    print(f"{month}-{day}, average valence: {average_valence}")

# Write the average daily valence values to a file
with open('average_daily_valence.txt', 'w') as output_file:
    for day, average_valence in average_daily_valence.items():
        output_file.write(f"{day}: {average_valence}\n")

# def calculate_valence(file):
    # # check if month and day are the same
    # # fetch the valence of all songs and find the average for each day
    # # store daily valence averages and variances/standard error bars
    # for track in data:
    #     if (track['month'])
     



# def calculate_danceability(file):

# def calculate_energy(file):   

# def calculate_acousticness(file):

# def calculate_tempo(file):

# def calculate_speechiness(file):
