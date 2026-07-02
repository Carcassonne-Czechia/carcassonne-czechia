import csv
from pathlib import Path

# Paths
input_file = Path(__file__).parent.parent / "src" / "raw-data" / "offline-championships" / "all_data.csv"
output_file = Path(__file__).parent.parent / "src" / "raw-data" / "offline-championships" / "champions.csv"

# Read the input CSV and extract champions (position == 1)
champions = []

with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['position'] == '1':
            champions.append({
                'Name': row['name'],
                'Country': '',  # Not in source data
                'BGA name': '',  # Not in source data
                'Year': row['year'],
                'Title': 'Champ',
                'Played in WC?': 'yes',
                'Data added by': 'posij118'
            })

# Sort by year
champions.sort(key=lambda x: int(x['Year']))

# Write the output CSV
with open(output_file, 'w', encoding='utf-8', newline='') as f:
    fieldnames = ['Name', 'Country', 'BGA name', 'Year', 'Title', 'Played in WC?', 'Data added by']
    writer = csv.DictWriter(f, fieldnames=fieldnames, delimiter='\t')
    writer.writeheader()
    writer.writerows(champions)

print(f"Champions CSV created: {output_file}")
print(f"Total champions extracted: {len(champions)}")
