import numpy as np
import json
from collections import defaultdict
import os

# A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. 
# Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), 
# while tracks with low valence sound more negative (e.g. sad, depressed, angry).

with open('data_processing/final_data_records_jamie.json', 'r') as file:
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
error_bars_daily_attributes = {}
for day, attributes in attributes_by_date.items():
    average_daily_attributes[day] = {
        'valence_avg' : sum(attributes['valence_avg'])/len(attributes['valence_avg']),
        'danceability_avg': sum(attributes['danceability_avg'])/len(attributes['danceability_avg']),
        'energy_avg' : sum(attributes['energy_avg'])/len(attributes['energy_avg']),
        'acousticness_avg': sum(attributes['acousticness_avg'])/len(attributes['acousticness_avg']),
        'tempo_avg': sum(attributes['tempo_avg'])/len(attributes['tempo_avg']),
        'speechiness_avg': sum(attributes['speechiness_avg'])/len(attributes['speechiness_avg'])
    }
with open('yearly_trends/daily_average_attributes_jamie.json', 'w') as output_file:
    json.dump(average_daily_attributes, output_file, indent=4)


for day, attributes in attributes_by_date.items():
    valence_avg = sum(attributes['valence_avg'])/(len(attributes['valence_avg']))
    danceability_avg = sum(attributes['danceability_avg'])/(len(attributes['danceability_avg']))
    energy_avg = sum((attributes['energy_avg']))/(len(attributes['energy_avg']))
    acousticness_avg = sum(attributes['acousticness_avg'])/(len(attributes['acousticness_avg']))
    tempo_avg = sum(attributes['tempo_avg'])/(len(attributes['tempo_avg']))
    speechiness_avg = sum(attributes['speechiness_avg'])/(len(attributes['speechiness_avg']))

    valence_stderr = np.std(attributes['valence_avg'])/np.sqrt(len(attributes['valence_avg']))
    danceability_stderr = np.std(attributes['danceability_avg'])/np.sqrt(len(attributes['danceability_avg']))
    energy_stderr = np.std((attributes['energy_avg']))/np.sqrt(len(attributes['energy_avg']))
    acousticness_stderr = np.std(attributes['acousticness_avg'])/np.sqrt(len(attributes['acousticness_avg']))
    tempo_stderr = np.std(attributes['tempo_avg'])/np.sqrt(len(attributes['tempo_avg']))
    # speechiness_stderr = np.std(attributes['speechiness_avg'])/np.sqrt((attributes['speechiness_avg']))
    error_bars_daily_attributes[day] = {
        'valence_error_bounds' : (valence_avg - valence_stderr, valence_avg + valence_stderr),
        'danceability_error_bounds': (danceability_avg - danceability_stderr, danceability_avg + danceability_stderr),
        'energy_error_bounds' : (energy_avg - energy_stderr, energy_avg + energy_stderr),
        'acousticness_error_bounds': (acousticness_avg - acousticness_stderr, acousticness_avg + acousticness_stderr),
        'tempo_error_bounds': (tempo_avg - tempo_stderr, tempo_avg + tempo_stderr),
        # 'speechiness_error_bounds': (speechiness_avg - speechiness_stderr, speechiness_avg + speechiness_stderr)
    }

with open('yearly_trends/daily_stderror_attributes_jamie.json', 'w') as stderr_file:
    json.dump(error_bars_daily_attributes, stderr_file, indent=4)

average_daily_valence = {}
variance_daily_valence = {}
for day, valences in valence_by_date.items():
    average_daily_valence[day] = (sum(valences)/len(valences))
    variance_daily_valence[day] = np.var(valences)

average_daily_danceability = {}
variance_daily_danceability = {}
for day, danceabilities in danceability_by_date.items():
    average_daily_danceability[day] = (sum(danceabilities)/len(danceabilities))
    variance_daily_danceability[day] = np.var(danceabilities)

average_daily_energy = {}
variance_daily_energy = {}
for day, energies in energy_by_date.items():
    average_daily_energy[day] = (sum(energies)/len(energies))
    variance_daily_energy[day] = np.var(energies)

average_daily_acousticness = {}
variance_daily_acousticness = {}
for day, acoustics in acousticness_by_date.items():
    average_daily_acousticness[day] = (sum(acoustics)/len(acoustics))
    variance_daily_acousticness[day] = np.var(acoustics)

average_daily_tempo = {}
variance_daily_tempo = {}
for day, tempos in tempo_by_date.items():
    average_daily_tempo[day] = (sum(tempos)/len(tempos))
    variance_daily_tempo[day] = np.var(tempos)

average_daily_speechiness = {}
variance_daily_speechiness = {}
for day, speeches in speechiness_by_date.items():
    average_daily_speechiness[day] = (sum(speeches)/len(speeches))
    variance_daily_speechiness[day] = np.var(speeches)


# # Write the average daily valence values to a file
# with open('yearly_trends/average_daily_valence.txt', 'w') as output_file:
#     for day, average_valence in average_daily_valence.items():
#         output_file.write(f"{day}: {average_valence}\n")

# with open('yearly_trends/average_daily_danceability.txt', 'w') as output_file:
#     for day, average_danceability in average_daily_danceability.items():
#         output_file.write(f"{day}: {average_danceability}\n")

# with open('yearly_trends/average_daily_energy.txt', 'w') as output_file:
#     for day, average_energy in average_daily_energy.items():
#         output_file.write(f"{day}: {average_energy}\n")

# with open('yearly_trends/average_daily_acousticness.txt', 'w') as output_file:
#     for day, average_acousticness in average_daily_acousticness.items():
#         output_file.write(f"{day}: {average_acousticness}\n")

# with open('yearly_trends/average_daily_tempo.txt', 'w') as output_file:
#     for day, average_tempo in average_daily_tempo.items():
#         output_file.write(f"{day}: {average_tempo}\n")

# with open('yearly_trends/average_daily_speechiness.txt', 'w') as output_file:
#     for day, average_speechiness in average_daily_speechiness.items():
#         output_file.write(f"{day}: {average_speechiness}\n")



# def convert_to_date(str_date):
#     month, day = map(int, str_date.split('-'))
#     return f"2023-{month}-{day}"

# # Read data from the original JSON file
# with open('/Users/anami/Documents/musaic/yearly_trends/daily_average_attributes_melanie.json', 'r') as file:
#     dData = json.load(file)

# # Convert string dates to JavaScript Date objects
# new_data = {}
# for key, value in dData.items():
#     new_data[convert_to_date(key)] = value

# # Write the updated data to a new JavaScript file
# with open('yearly_trends/date_formatted_melanie_dailydata.js', 'w') as file:
#     file.write('const newData = ')
#     json.dump(new_data, file, indent=4)
#     file.write(';')
