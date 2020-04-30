# ugly ugly code
import json
import urllib.request
import csv
import os
from datetime import date, timedelta
import matplotlib.pyplot as plt
import matplotlib.dates as md
import dateutil
import numpy as np
def date_getter(chosen_date, offset, n):
    previous_date = chosen_date - timedelta(days=n+offset)
    year = str(previous_date.year)
    if previous_date.month < 10:
        month = "0"+str(previous_date.month)
    else:
        month = str(previous_date.month)
    if previous_date.day < 10:
        day = "0"+str(previous_date.day)
    else:
        day = str(previous_date.day)
    date_at = year + "-" + month + "-" + day
    return date_at

def csv_parser():
    dates = []

    pm2_list = []
    days = 110
    daily_averages = []
    daily_dates = []
    for n in range(days):
     date_chosen = date_getter(date.today(), 4, n)
     pm10_list = []
     with open(date_chosen+'/sds011/31706.csv', 'rt') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=";", quotechar="|")
        rowcount = 0
        for row in spamreader:
            if rowcount == 0:
                print("skipping")
            else:
                time_and_date = row[5]
                pm10 = row[6]
                pm2 = row[9]
                hours = time_and_date[11:]
                dates.append(hours)
                pm10_list.append(float(pm10))
                pm2_list.append(float(pm2))
            rowcount+=1
        daily_dates.append(date_chosen)
        print(np.average(pm10_list))
        #daily_averages.append(np.average(pm10_list))
        daily_averages.append(np.average(pm2_list))
    real_dates = dates
    
    plt.plot(daily_dates, daily_averages)
    plt.show()
csv_parser()
