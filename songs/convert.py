import os
import json

def collect_songs_from_folder(folder_path, mood_name):
    songs = []

    for file in os.listdir(folder_path):
        if file.lower().endswith((".mp3", ".wav", ".ogg", ".flac", ".aac")):
            songs.append(file)

    return {mood_name: songs}

# Replace this with your actual path
folder_path = r"F:\personal projects web\real spotify clone\songs\rap"
mood_name = "Rap"

songs_data = collect_songs_from_folder(folder_path, mood_name)

# Save to JSON
with open("rap.json", "w", encoding='utf-8') as f:
    json.dump(songs_data, f, indent=4)

print("songs.json file created successfully!")
