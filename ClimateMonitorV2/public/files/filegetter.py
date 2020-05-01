import json
import urllib.request
import os
import time
from datetime import date, timedelta

# download raw json object
url = "http://api.luftdaten.info/static/v2/data.24h.json"
data = urllib.request.urlopen(url).read().decode()

# parse json object
obj = json.loads(data)
print("Done")
# output some object attributes
print(obj[0]["location"])
list_of_sensors = []
for n in obj:
    latitude = float(n["location"]["latitude"])
    longitude = float(n["location"]["longitude"])
    if (longitude > -1.58 and longitude < -1.34 and latitude <= 53.468 and latitude >= 53.29):
        if (n["sensor"]["sensor_type"]["name"] == "SDS011"):
            list_of_sensors.append(n["sensor"]["id"])
print("Found all sensors in sheffield")
print(list_of_sensors)
print(len(list_of_sensors))
print("Beginning to take dates, first one:")
amount_of_days = 365
# Print iterations progress

# Initial call to print 0% progress


progresscounter = amount_of_days*len(list_of_sensors)


currprog = 0
list_of_sensors = [31706]

for n in range(amount_of_days):
    for sensor in list_of_sensors:
        previous_date = date.today() - timedelta(days=n+2)
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
        folder = date_at+"/sds011/"
        print ("Creating: " + date_at + folder + "Sensor Number: " + str(sensor))
        url = "http://archive.sensor.community/"+date_at+"/"+date_at+"_"+"sds011_sensor_"+str(sensor)+".csv"
        print(url)
        if os.path.exists(folder):
            print("Folder already exists, so not making a new one")
        else:
            os.makedirs(folder)
        file = str(sensor)+".csv"
        full_file_dir = folder+file
        if os.path.exists(full_file_dir):
            print("File Exists, so Skipping!")
        else:
            try:
                urllib.request.urlretrieve(url, full_file_dir)
            except urllib.error.HTTPError:
                print("HTTP error, skipping")
                time.sleep(1)
        currprog += 1
        print("Current Download Progress:")
        print(currprog/progresscounter*100)
        time.sleep(0.1)
        
        
