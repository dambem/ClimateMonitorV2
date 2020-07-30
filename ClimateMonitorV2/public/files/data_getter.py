import csv
import datetime
import os
from datetime import date, timedelta
from matplotlib.ticker import MultipleLocator
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np

def date_getter(chosen_date, offset, n):
    previous_date = chosen_date - timedelta(days=n + offset)
    year = str(previous_date.year)
    if previous_date.month < 10:
        month = "0" + str(previous_date.month)
    else:
        month = str(previous_date.month)
    if previous_date.day < 10:
        day = "0" + str(previous_date.day)
    else:
        day = str(previous_date.day)
    date_at = year + "-" + month + "-" + day
    return date_at


dates = []
days = 365
daily_averages = []
daily_dates = []
for n in range(days):
    date_chosen = date_getter(date.today(), 4, n)
    pm10_list = []
    pm2_list = []
    try:
        with open(date_chosen + '/sds011/31706.csv', 'rt') as csvfile:
            spamreader = csv.reader(csvfile, delimiter=";", quotechar="|")
            rowcount = 0
            for row in spamreader:
                if rowcount == 0:
                    pass
                else:
                    time_and_date = row[5]
                    pm10 = row[6]
                    pm2 = row[9]
                    hours = time_and_date[11:]
                    dates.append(hours)
                    pm10_list.append(float(pm10))
                    pm2_list.append(float(pm2))
                rowcount += 1
            daily_dates.append(date_chosen)
            daily_averages.append(np.average(pm2_list))
    except:
        pass

daily_dates = [datetime.datetime.strptime(d, "%Y-%m-%d").date() for d in daily_dates]
ax = plt.gca()
formatter = mdates.DateFormatter("%Y-%m-%d")
ax.xaxis.set_major_formatter(formatter)
locator = mdates.DayLocator()
ax.xaxis.set_major_locator(locator)
ax.xaxis.set_minor_locator(MultipleLocator(1))

# high res
# plt.figure(figsize=(64,27))

# not high res
plt.figure(figsize=(16, 9))
plt.title('Average Daily PM2 Value vs Time')
plt.ylabel('Average Daily PM2 Value')
plt.xlabel('Date')
plt.plot(daily_dates, daily_averages)
plt.savefig(os.getcwd() + "images/PM2Daily" + date_chosen + ".png", dpi=100)
plt.show()
