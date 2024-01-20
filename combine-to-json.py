import json
import re

def create_json_from_files(file1, file2, output_file):
    with open(file1, 'r', encoding='utf-8') as f1, open(file2, 'r', encoding='utf-8') as f2:
        keys = f1.readlines()
        values = f2.readlines()

    json_data = {}
    for key, value in zip(keys, values):
        # Extracting the actual data from the "line-by-line.txt" file
        match = re.search(r'Line \d+: (.*)', value)
        data = match.group(1) if match else ''

        json_data[key.strip()] = data

    # Saving the data to a JSON file
    with open(output_file, 'w', encoding='utf-8') as outfile:
        json.dump(json_data, outfile, indent=4, ensure_ascii=False)

# File paths
uncleaned_wiki_countries = './uncleaned_wiki_countries.txt'  # Update with actual file path
line_by_line = './line-by-line.txt'  # Update with actual file path
output_json = 'output-country-borders.json'  # Output JSON file name

# Creating the JSON file
create_json_from_files(uncleaned_wiki_countries, line_by_line, output_json)
