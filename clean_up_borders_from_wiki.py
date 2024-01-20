import re

def extract_country_names(line):
    # Removing any numeric and special characters that are not part of country names
    cleaned_line = re.sub(r'\d+|\[.*?\]|\(.*?\)|\xa0km|\xa0mi', '', line)

    # Splitting the cleaned line into potential country names
    potential_countries = re.split(r'\,|\:', cleaned_line)

    # Cleaning and filtering the extracted names
    cleaned_countries = []
    for country in potential_countries:
        # Remove unwanted characters and split by space to isolate country names
        parts = re.sub(r'[^a-zA-Z\s\'\-]', '', country).split()
        country_name = ' '.join(part for part in parts if part.isalpha() or part in ["'", "-"])
        if country_name:
            cleaned_countries.append(country_name.strip())

    return cleaned_countries

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    # Process each line in the file, extract country names, and add line numbers
    refined_extracted_countries_with_line_numbers = [
        f"Line {index + 1}: {', '.join(extract_country_names(line))}" for index, line in enumerate(lines)
    ]

    # Output the processed lines
    for line in refined_extracted_countries_with_line_numbers:
        print(line)

# Asking for file input
file_path = input("Enter the path to your file: ")
process_file(file_path)
