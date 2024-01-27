import json

#geojson_filepath = '/Users/VM/chatgpt-geo-3/frontend/public/custom.geo.json'
geojson_filepath = '/Users/VM/chatgpt-geo-3/frontend/public/COUNTRIESJSON.json.geojson'
#country_borders_filepath = '/Users/VM/chatgpt-geo-3/frontend/public/country-borders.json'
country_borders_filepath = '/Users/VM/chatgpt-geo-3/frontend/public/all_border_data.json'
#NEW_geojson_filepath='/Users/VM/chatgpt-geo-3/frontend/public/output.geojson'


global geojson_data, country_border_data;


try:
    with open(geojson_filepath, 'r', encoding='utf-8') as file:
        geojson_data = json.load(file)
except Exception as e:
    print(f"Error reading the .geojson file: {e}")

try:
    with open(country_borders_filepath, 'r', encoding='utf-8') as file:
        country_border_data = json.load(file)
except Exception as e:
    print(f"Error reading the country borders file: {e}")

countrynameslist=[]

geojson_country_name_not_in_border_keys = []

for c in geojson_data['features']:
    if c['properties']['ADMIN'] is None:
        print('country has no ADMIN attribute')
        print('printing name_en instead')
        print(c['properties']['NAME_EN'])
    else:
        current_geojson_country_name = c['properties']['ADMIN']
        countrynameslist.append(current_geojson_country_name)
        if current_geojson_country_name not in country_border_data.keys():
            geojson_country_name_not_in_border_keys.append(current_geojson_country_name)


keynotinlist=[]
for c in country_border_data.keys():
    if c not in countrynameslist:
        keynotinlist.append(c)



borderingcountries_valueslist=[]
for bordering_all in country_border_data.values():
    for c in bordering_all:
        if c not in countrynameslist:
            borderingcountries_valueslist.append(c)

valuesnotingeojson = list(set(borderingcountries_valueslist))
print('--------current_geojson_country_name not in border keys:--------------')
print('\n'.join(f'current_geojson_country_name not in border keys: {i}' for i in sorted(geojson_country_name_not_in_border_keys)))
print('-------------------------')

print('---------country_name not in big list-------------')
print('\n'.join(f'country_name not in big list: {i}' for i in sorted(keynotinlist)))
print('----------------------')

print('------bordering-countries value not in big list----------------')
print('\n'.join(f'bordering-countries value not in big list: {i}' for i in sorted(valuesnotingeojson)))
print('----------------------')

print('done')
exit(0)
