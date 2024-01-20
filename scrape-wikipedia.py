import requests
from bs4 import BeautifulSoup

url = "https://en.wikipedia.org/wiki/List_of_countries_and_territories_by_number_of_land_borders"

# Sending a GET request to the URL
response = requests.get(url)

# Parsing the HTML content of the page
soup = BeautifulSoup(response.content, 'html.parser')

# Finding the table under the "Land Borders" header
# Assuming it is the first table after the header
land_borders_header = soup.find('span', {'id': 'Land_borders'})
table = land_borders_header.find_next('table')

# Extracting all rows of the table
rows = table.find_all('tr')

# Iterating over each row
for row in rows[1:]:  # Skipping the header row
    cells = row.find_all('td')
    if cells:
        country_or_territory = cells[0].get_text(strip=True)
        print(country_or_territory)