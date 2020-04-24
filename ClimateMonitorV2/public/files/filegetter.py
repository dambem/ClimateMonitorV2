import json
import urllib.request
import os
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
amount_of_days = 120
# Print iterations progress

# Initial call to print 0% progress
list_of_sensors = [31706]


progresscounter = amount_of_days*len(list_of_sensors)


currprog = 0

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
        url = "http://archive.luftdaten.info/"+date_at+"/"+date_at+"_"+"sds011_sensor_"+str(sensor)+".csv"
        try:
            os.makedirs(folder)
        except FileExistsError:
            print("Folder Already exists!!")
        try:
            urllib.request.urlretrieve(url, date_at+"/sds011/"+str(sensor)+".csv")
        except PermissionError:
            print("File Already Exists! So Skipping...")
        currprog += 1
        print("Current Download Progress:")
        print(currprog/progresscounter)
        
        
