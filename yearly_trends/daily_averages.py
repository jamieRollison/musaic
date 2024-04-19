import numpy as np
import json
from collections import defaultdict
import os

# A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. 
# Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), 
# while tracks with low valence sound more negative (e.g. sad, depressed, angry).

with open('/Users/anami/Documents/musaic/data_processing/final_data_records_jamie.json', 'r') as file:
    # Load the JSON data into a Python dictionary
    data = json.load(file)

# Now you can access the data as a Python dictionary
print(data)
valence_by_date = defaultdict(list)
danceability_by_date = defaultdict(list)
energy_by_date = defaultdict(list)
acousticness_by_date = defaultdict(list)
tempo_by_date = defaultdict(list)
speechiness_by_date = defaultdict(list)
attributes_by_date = defaultdict(lambda: defaultdict(list))


for track in data:
    month = track['month']
    day = track['day']
    valence = track['valence']
    danceability = track['danceability']
    energy = track['energy']
    acousticness = track['acousticness']
    tempo = track['tempo']
    speechiness = track['speechiness']

    date_key = f"{month}-{day}"
    valence_by_date[date_key].append(valence)
    danceability_by_date[date_key].append(danceability)
    energy_by_date[date_key].append(energy)
    acousticness_by_date[date_key].append(acousticness)
    tempo_by_date[date_key].append(tempo)
    speechiness_by_date[date_key].append(speechiness)


    attributes_by_date[date_key]['valence_avg'].append(valence)
    attributes_by_date[date_key]['danceability_avg'].append(danceability)
    attributes_by_date[date_key]['energy_avg'].append(energy)
    attributes_by_date[date_key]['acousticness_avg'].append(acousticness)
    attributes_by_date[date_key]['tempo_avg'].append(tempo)
    attributes_by_date[date_key]['speechiness_avg'].append(speechiness)
    

# write avg values for all attributes per day to JSON file
average_daily_attributes = {}
for day, attributes in attributes_by_date.items():
    average_daily_attributes[day] = {
        'valence_avg' : sum(attributes['valence_avg'])/len(attributes['valence_avg']),
        'danceability_avg': sum(attributes['danceability_avg'])/len(attributes['danceability_avg']),
        'energy_avg' : sum(attributes['energy_avg'])/len(attributes['energy_avg']),
        'acousticness_avg': sum(attributes['acousticness_avg'])/len(attributes['acousticness_avg']),
        'tempo_avg': sum(attributes['tempo_avg'])/len(attributes['tempo_avg']),
        'speechiness_avg': sum(attributes['speechiness_avg'])/len(attributes['speechiness_avg'])
    }
with open('yearly_trends/daily_average_attributes.json', 'w') as output_file:
    json.dump(average_daily_attributes, output_file, indent=4)



average_daily_valence = {}
for day, valences in valence_by_date.items():
    average_daily_valence[day] = (sum(valences)/len(valences))

average_daily_danceability = {}
for day, danceabilities in danceability_by_date.items():
    average_daily_danceability[day] = (sum(danceabilities)/len(danceabilities))

average_daily_energy = {}
for day, energies in energy_by_date.items():
    average_daily_energy[day] = (sum(energies)/len(energies))

average_daily_acousticness = {}
for day, acoustics in acousticness_by_date.items():
    average_daily_acousticness[day] = (sum(acoustics)/len(acoustics))

average_daily_tempo = {}
for day, tempos in tempo_by_date.items():
    average_daily_tempo[day] = (sum(tempos)/len(tempos))

average_daily_speechiness = {}
for day, speeches in speechiness_by_date.items():
    average_daily_speechiness[day] = (sum(speeches)/len(speeches))


# Write the average daily valence values to a file
with open('yearly_trends/average_daily_valence.txt', 'w') as output_file:
    for day, average_valence in average_daily_valence.items():
        output_file.write(f"{day}: {average_valence}\n")

with open('yearly_trends/average_daily_danceability.txt', 'w') as output_file:
    for day, average_danceability in average_daily_danceability.items():
        output_file.write(f"{day}: {average_danceability}\n")

with open('yearly_trends/average_daily_energy.txt', 'w') as output_file:
    for day, average_energy in average_daily_energy.items():
        output_file.write(f"{day}: {average_energy}\n")

with open('yearly_trends/average_daily_acousticness.txt', 'w') as output_file:
    for day, average_acousticness in average_daily_acousticness.items():
        output_file.write(f"{day}: {average_acousticness}\n")

with open('yearly_trends/average_daily_tempo.txt', 'w') as output_file:
    for day, average_tempo in average_daily_tempo.items():
        output_file.write(f"{day}: {average_tempo}\n")

with open('yearly_trends/average_daily_speechiness.txt', 'w') as output_file:
    for day, average_speechiness in average_daily_speechiness.items():
        output_file.write(f"{day}: {average_speechiness}\n")


# for day, average_tempo in average_daily_valence.items():    # FOR TESTING
#     print(f"{day}, average valence: {average_valence}")
