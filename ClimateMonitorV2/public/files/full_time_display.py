import json
import urllib.request
import csv
import os
import datetime
from datetime import date, timedelta
from matplotlib.ticker import (MultipleLocator, FormatStrFormatter,
                               AutoMinorLocator)
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
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
    pm2_list = []
    pm10_list = []
    days = 10
    daily_averages = []
    daily_dates = []
    for n in range(days):
     date_chosen = date_getter(date.today(), 4, n)
     #print(date_chosen)
     with open(date_chosen+'/sds011/31706.csv', 'rt') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=";", quotechar="|")
        rowcount = 0
        for row in spamreader:
            if rowcount == 0:
                pass
            else:
                time_and_date = row[5]
                actual_date = datetime.datetime.strptime(time_and_date, "%Y-%m-%dT%H:%M:%S")
               
                pm10 = row[6]
                pm2 = row[9]
                hours = time_and_date[11:]
                pm10_list.append(float(pm10))
                pm2_list.append(float(pm2))
                daily_dates.append(actual_date)
                plt.scatter(actual_date, pm2)
            rowcount+=1
    
    ax = plt.gca()
    formatter = mdates.DateFormatter("%Y-%m-%d")
    ax.xaxis.set_major_formatter(formatter)
    locator = mdates.DayLocator()
    ax.xaxis.set_major_locator(locator)
    ax.xaxis.set_minor_locator(MultipleLocator(1))
    #high res
    #plt.figure(figsize=(64,27))
    # not high res
    
    plt.figure(figsize=(16,9))
    plt.title('Average Daily PM2 Value vs Time')
    plt.ylabel('Average Daily PM2 Value')
    plt.xlabel('Date')
    plt.scatter(daily_dates, pm10_list)
    plt.savefig("images/PM2Full"+date_chosen+".png", dpi=100)

csv_parser()
