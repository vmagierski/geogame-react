import csv
import json

d = {}
with open('borders.csv', 'rb') as f:
    reader = csv.reader(f)
    for row in reader:
        if len(row) >= 2:  # Ensure there are at least two columns
            a, b = row[0].strip(), row[1].strip()
            d.setdefault(a, []).append(b)


print(d)

