import requests
from bs4 import BeautifulSoup

import sqlite3
con = sqlite3.connect("../dataStore/data.db")
cur = con.cursor()

from datetime import datetime

def convert_date_to_iso(date_str):
    month_mapping = {
        "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
        "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
        "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
    }
    
    parts = date_str.split(" ")
    
    day = parts[0]
    month = parts[1]
    year = parts[2]
    
    month_num = month_mapping[month]

    return f"{year}-{month_num}-{day.zfill(2)}"


print("Scraping...")
r = requests.get("https://infopark.in/companies/jobs", verify = False)

soup = BeautifulSoup(r.text, "lxml")

print("Finished scraping")

company_list = soup.find_all("div", class_="company-list")

batch_insert_data = []

now = datetime.now()

for listing in company_list:
    job_id = int(listing.select("a")[0]["href"].split("/")[-1])

    res = cur.execute("SELECT job_id FROM jobs WHERE job_id = ?", [job_id])
    existing_id = res.fetchone()

    if existing_id:
        continue

    job_title = listing.select("a")[0].text
    job_link = listing.select("a")[0]["href"]
    company_name = listing.select("a")[1].text
    company_link = listing.select("a")[1]["href"]
    last_date = convert_date_to_iso(listing.select("div")[2].text)

    date_added = now

    batch_insert_data.append(tuple([job_id, job_title, job_link, company_name, company_link, last_date, date_added]))


if batch_insert_data:
    cur.executemany("INSERT INTO jobs (job_id, job_title, job_link, company_name, company_link, last_date, date_added) VALUES(?, ?, ?, ?, ?, ?, ?)", batch_insert_data)
    con.commit()

# sqlite3 default adapter and converter deprecated as of python 3.12
def adapt_datetime_iso(val):
    """Adapt datetime.datetime to timezone-naive ISO 8601 date."""
    return val.isoformat()

sqlite3.register_adapter(datetime, adapt_datetime_iso)

cur.execute("UPDATE trivia SET last_updated = ?", [now])
con.commit()