import json
import urllib.request
import datetime

datetime_object = datetime.datetime.now()
current_year = datetime_object.year
current_month = datetime_object.month
current_day = datetime_object.day

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


