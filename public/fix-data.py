import json

# Path to your existing JSON file
input_file = 'output-country-borders.json'

# Path for the new JSON file
output_file = 'country-borders.json'

def convert_borders_data(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)

    converted_data = {}
    for country, borders in data.items():
        # Convert comma-separated string to list, filter out empty strings
        converted_data[country] = [border.strip() for border in borders.split(',') if border.strip()]

    return converted_data

# Perform the conversion
new_borders_data = convert_borders_data(input_file)

# Save the new data to a file
with open(output_file, 'w') as f:
    json.dump(new_borders_data, f, indent=4)

print(f"Converted data saved to {output_file}")
