"""
Scraping scores of online championship into a consistent format. Light on deskohrani servers.

Data is saved to `src/raw-data/offline-championships`.
"""

import requests
import datetime
import os
from html.parser import HTMLParser
import csv
import math
from dotenv import load_dotenv
import pickle
from unidecode import unidecode

load_dotenv("../.env")

NAME = "name"
YEAR = "year"
POSITION = "position"
POINTS = "points"
SCORE_DIFFERENCE = "scoreDifference"

raw_data_base_path = (
    os.path.join("src", "raw-data", "offline-championships")
    if os.getenv("CI")
    else os.path.join("..", "src", "raw-data", "offline-championships")
)
all_data = [(YEAR, POSITION, NAME, POINTS, SCORE_DIFFERENCE)]

# UTILS


def replace_decimal_separators(raw_scores: list[list[str]]) -> list[list[str]]:
    return [[score.replace(",", ".") for score in row] for row in raw_scores]


"""
Unites names with missing diacritics with those which have it. 

e.g. If Martin Mojžíš and Martin Mojzis are both in the table, all occurences will be changed to Martin Mojžíš.
"""


def add_diacritics_if_present():
    name_column_index = all_data[0].index(NAME)
    name_column = [row[name_column_index] for row in all_data]

    for i, name in enumerate(name_column):
        for other_name in name_column:
            if (
                name == unidecode(name)
                and name == unidecode(other_name)
                and other_name != name
            ):
                all_data[i][name_column_index] = other_name


def add_zeros_where_missing(raw_scores: list[list[str]]):
    for i in range(len(raw_scores)):
        for j in range(len(raw_scores[0])):
            if raw_scores[i][j].lstrip().rstrip() == "":
                raw_scores[i][j] = "0"

    return raw_scores


# END-UTILS

"""
@raw_scores: Given as a list of length `num_players`, each entry is a variable 

@return: A list of length `num_players`, only keeping points scored and a score difference. The return object has always two columns.
"""


def clean_up_raw_scores(raw_scores: list[list[str]]) -> list[tuple[str, ...]]:
    raw_scores = replace_decimal_separators(raw_scores)
    raw_scores = add_zeros_where_missing(raw_scores)
    points_scored_avg_max = 20
    points_scored_avg_min = 0.5

    score_differences_stdev_max = 150
    score_differences_stdev_min = 20
    score_differences_avg_max = 30
    score_differences_avg_min = -30

    num_columns = len(raw_scores[0])

    points_scored = [str(0) for _ in raw_scores]
    score_differences = [str(0) for _ in raw_scores]

    # Get points scored, prioritizing left-most columns
    for i in reversed(range(num_columns)):
        column = [score[i].rstrip() for score in raw_scores]

        # If cannot be converted to floats, skip
        try:
            column_floats = [float(val) for val in column]
        except ValueError:
            continue

        average = sum(column_floats) / len(column_floats)
        if average > points_scored_avg_min and average < points_scored_avg_max:
            points_scored = column

    # Get score differences
    for i in range(num_columns):
        column = [score[i] for score in raw_scores]

        # If cannot be converted to floats, compute the differences
        try:
            column_floats = [float(val) for val in column]
        except ValueError:
            column_floats = [
                (
                    float(val.split("-")[0]) - float(val.split("-")[1])
                    if val.count("-")
                    else 0
                )
                for val in column
            ]

        average = sum(column_floats) / len(column_floats)
        stdev = math.sqrt(
            sum([val * val for val in column_floats]) / len(column_floats)
        )

        if (
            average > score_differences_avg_min
            and average < score_differences_avg_max
            and stdev > score_differences_stdev_min
            and stdev < score_differences_stdev_max
        ):
            score_differences = [str(int(val)).rstrip() for val in column_floats]

    return list(zip(points_scored, score_differences))


def print_file(data: list[tuple[str, ...]], dir=raw_data_base_path):
    with open(
        os.path.join(dir, "all_data.csv"), "w", newline="", encoding="utf-8"
    ) as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(data)

namesakes = [{"year": 2013, "incorrect": "Jan Heřman", "correct": "Jan Heřman II"}]

# We use 1-based row and column indexing, first place at 3rd row due to rowspan 2
class DeskohraniHTMLParser(HTMLParser):
    def __init__(self, year: int):
        super().__init__()
        self.row_number = 0
        self.raw_scores = []
        self.names = []
        self.year = year
        self.criteria_colspan = 1

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.row_number += 1
            self.col_number = 0

        if tag == "td" or tag == "th":
            self.col_number += 1
            for attr in attrs:
                if attr[0] == "colspan":
                    self.col_number += int(attr[1]) - 1
                if attr[0] == "colspan" and self.row_number == 1:
                    self.criteria_colspan = int(attr[1])

    def handle_endtag(self, tag):
        if tag == "html":
            cleaned_up_scores = clean_up_raw_scores(self.raw_scores)
            length = len(cleaned_up_scores)
            self.data = list(
                zip(
                    [self.year] * length,
                    range(1, length + 1),
                    self.names,
                    *list(zip(*cleaned_up_scores))
                )
            )

    def handle_data(self, data):
        if self.row_number == 1:
            if data == "Jméno":
                self.name_col = self.col_number
            if data == "Kritéria":
                self.criteria_col = self.col_number - self.criteria_colspan + 1

        elif self.row_number >= 3:
            if self.col_number == self.name_col:
                # Fix namesakes
                for namesake in namesakes:
                    if self.year == namesake["year"] and data.rstrip() == namesake[
                        "incorrect"
                    ]:
                        data = namesake["correct"]
                self.names.append(data.rstrip())
            if self.col_number == self.criteria_col:
                self.raw_scores.append([])
            if (
                self.col_number >= self.criteria_col
                and self.col_number < self.criteria_col + self.criteria_colspan
            ):
                self.raw_scores[-1].append(data)


# Do not flood the deskohrani servers during local testing
inaugural_year = 2003 if os.getenv("CI") or os.getenv("TEST_ALL_YEARS") else 2023
current_year = datetime.datetime.now().year

# Do allow testing before the current year website is available
current_month = datetime.datetime.now().month
if current_month < 10:
    current_year -= 1

# No championship in 2020
missing_years = [2020]
years_range = list(
    set(range(inaugural_year, current_year + 1)).difference(missing_years)
)

# Check if scraped data available
# They are never pushed to GitHub so the action always scrapes the new values.
scraped_responses_found = False
p = os.path.join(raw_data_base_path, "scraped_{}.pickle".format(inaugural_year))

if os.path.exists(p):
    scraped_responses_found = True
    with open(p, "r+b") as scrapedFile:
        responses = pickle.load(scrapedFile)

if not scraped_responses_found:
    print(os.listdir(os.getcwd()))
    if not os.path.exists(raw_data_base_path):
        os.mkdir(raw_data_base_path)
    base_url = "https://deskohrani.cz/cgi/mso/index.pl?turnaj=mcr&text=uvod.htm&telo=vysledky.pl&rok={}&jazyk=cs&hra=car"
    url_list = [base_url.format(year) for year in years_range]
    responses = [requests.get(url) for url in url_list]
    with open(p, "x+b") as scrapedFile:
        pickle.dump(responses, scrapedFile)

# Check if all successful
for response in responses:
    if response.status_code != 200:
        print(response.reason)
        exit()

parsers = [DeskohraniHTMLParser(year) for year in years_range]

for parser, response in zip(parsers, responses):
    parser.feed(response.text)
    all_data += parser.data
    parser.close()

add_diacritics_if_present()
print_file(all_data)
