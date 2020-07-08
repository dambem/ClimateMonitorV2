# Sheffield Climate Monitor (for PM10 and PM2.5) ![alt text](https://github.com/dambem/ClimateMonitorV2/blob/master/ClimateMonitorV2/public/sheffsense.png "Logo Title Text 1")
## What is it?
SheffSense is a web application aimed towards making pollution data around Sheffield easily understandable and easily accessible. We specifcally focus on the pollutants PM10 and PM2.5

Now, more than ever the reality of our effects on the environment have become clearer. During the lockdown period, we experienced one of the biggest drops in pollution for a long time. But what does that actually mean? We keep getting told about drops and rises in pollution, but it seems to be slightly divorced from reality. Pollutants such as PM2.5 and PM10 are almost invisible to the naked eye, but they have disastrous effects on our health. SheffSense aims to make information about pollution not only freely available, but easily understandable.  

## Why?
By making the data freely and easily accesible and understandable, we woke that people will be able to take action, and change they're views regarding the importance of pollution in sheffield.
## What does this repo contain?
The majority of this repo is a bog-standard nodeJS express installation, however, in public/files you'll find two python files. One of which (file_getter.py) is to download archive.luftdaten.info to your local file-system, the second is to parse it into matplotlib in python, and gather some information. 
## How can I help?
We accept any contributors to this project, just contact Damian Bemben (dbemben1@sheffield.ac.uk) or, if you'd rather use our foundations, just make a fork and start working on it yourself! 
## Getting Started 
```javascript

npm install

npm start
```
## Running tests
- First run the app using `npm start`
- Run the tests using `npm t`
