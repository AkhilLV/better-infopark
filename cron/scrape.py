import concurrent.futures
import requests
import sqlite3
import urllib3
import time

from bs4 import BeautifulSoup
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


def fetch_page_listing(page):
    page_link = f"https://infopark.in/companies/job-search?page={page}&search="

    print(f"Fetching page {page} of {NUMBER_OF_PAGES} from {page_link}")
    r = requests.get(page_link, verify = False)
    page_soup = BeautifulSoup(r.text, "lxml")

    return page_soup.select("tbody tr")


urllib3.disable_warnings() # Disable SSL warnings, as the site is not using SSL

r = requests.get("https://infopark.in/companies/job-search", verify = False)

soup = BeautifulSoup(r.text, "lxml")

NUMBER_OF_PAGES = int(soup.select(".pagination a")[-2].text)

print(f"Fetching: {NUMBER_OF_PAGES}")

start = time.time()

all_listings = []

with concurrent.futures.ThreadPoolExecutor() as executor:
    results = [executor.submit(fetch_page_listing, i) for i in range(1, NUMBER_OF_PAGES + 1)]

    for f in concurrent.futures.as_completed(results):
        all_listings.extend(f.result())


end = time.time()
print(f"Fetched all listing in {end - start} seconds")
print(f"Total number of listings: {len(all_listings)}")

con = sqlite3.connect("../dataStore/data.db")
cur = con.cursor()

now = datetime.now()

batch_insert_data = []

for listing in all_listings:
    columns = listing.find_all("td")
    
    job_title = columns[0].text.strip()
    company_name = columns[1].text.strip()
    last_date = convert_date_to_iso(columns[2].text.strip())
    job_link = columns[3].find("a")["href"]
    
    job_id = int(job_link.split("/")[-2])  # Extracting job_id from URL
    company_id = job_link.split("/")[-1]  # Extracting company_id from URL
    company_link = f"https://infopark.in/companies/profile/{company_id}"
    
    res = cur.execute("SELECT job_id FROM jobs WHERE job_id = ?", [job_id])
    existing_id = res.fetchone()
    
    if existing_id:
        continue
    
    date_added = now
    
    batch_insert_data.append((job_id, job_title, job_link, company_name, company_link, last_date, date_added))


if batch_insert_data:
    cur.executemany("INSERT INTO jobs (job_id, job_title, job_link, company_name, company_link, last_date, date_added) VALUES(?, ?, ?, ?, ?, ?, ?)", batch_insert_data)
    con.commit()


print(f"Inserted {len(batch_insert_data)} new listings")

# sqlite3 default adapter and converter deprecated as of python 3.12
def adapt_datetime_iso(val):
    """Adapt datetime.datetime to timezone-naive ISO 8601 date."""
    return val.isoformat()

sqlite3.register_adapter(datetime, adapt_datetime_iso)

cur.execute("UPDATE trivia SET last_updated = ?", [now])
con.commit()