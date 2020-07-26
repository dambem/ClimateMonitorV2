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
To get started, you will need access to the `ClimateMonitorV2/ClimateMonitorV2/public/javascripts/config.js` file. This contains our map box and weather company api keys which are not for prying eyes, hence we have encrypted them using StackExchanges [BlackBox](https://github.com/StackExchange/blackbox) Secret Management System. If the file isn't encrypted, the website will not work properly so to gain access to the keys, please follow these steps:

*Steps to request access to blackbox*
1. If you don't have one already, [generate a gpg key](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-gpg-key). Ensure you use a keylength of at least 4096 bits and that the email you use to set it up is the same one you use to commit to this repository.
2. Now we shall roughly follow the steps laid out in the [blackbox repository](https://github.com/StackExchange/blackbox#how-to-indoctrinate-a-new-user-into-the-system). Before we do however, copy your github api/personal-access token to somewhere safe if it is currently in `config.js` (**THIS IS SUPER IMPORTANT AS YOUR TOKEN WILL BE DELETED OUT OF config.js**)
3. Create a new branch to work on that mirrors the current master branch.
```
git branch <branchname> && git checkout <branchname>
```
4. Now you can add yourself as an admin to the blackbox system:
```
blackbox_addadmin KEYNAME
```
...where "KEYNAME" is the email address listed in the gpg key you created previously. For example:
```
blackbox_addadmin tal@example.com
```
When the command completes successfully, instructions on how to commit these changes will be output. Run the command as given to commit the changes. It will look like this:
```
git add .blackbox/*
git commit -m 'NEW ADMIN: tal@example.com'
```
5. Push it to the repo
```
git push origin <branch-name>
```
6. As your last job, you will need to make a pull request to ask another admin to add you to the system. Use the `BLACKBOX_PULL_REQUEST` template to create your PR. Now you can sit back and wait for an admin to approve of your application (see below)

7. Once an admin has approved your request, pull in their approval and verify that you can decrypt and encrypt the file. 
```
git pull origin <branchname>
blackbox_edit_start <path-to-config.js>   # OR npm run decrypt
blackbox_edit_end <path-to-config.js>     # OR npm run encrypt
```

If you can, you're all setup! Inform the approver that all looks well and they will solidify the approval by merging it into master.

*Steps to approve blackbox requests*
1. If you are a blackbox admin, you should checkout the requesters branch to ensure it looks ok
```
git fetch
git checkout <requesters-branchname>
git pull origin <requesters-branchname>
gpg --homedir=.blackbox --list-keys   # Assuming that you're in the root directory of the repository
```
2. Import the keychain into your personal keychain and re-encrypt
```
gpg --import .blackbox/pubring.kbx    
# OR gpg --no-default-keyring --keyring .blackbox/pubring.kbx  --export -a | gpg --import if that doesn't work
blackbox_update_all_files
```
3. Push the re-encrypted files back to the requester
```
git commit -m "APPROVED: <requester-email-address>"
git push origin <requesters-branchname>
```
4. Remind requester to do step 7 to verify they can encrypt/decrypt files

Assuming you're now all setup with blackbox and have verified that you can encrypt/decrypt files, decrypt the `config.js` file:
```
npm run decrypt
```
Now the file should be in plaintext format, ready for you to make changes or run the website! 

When you're done editing, encrypt the file again so it can't be read
**MAKE SURE YOU DO THIS BEFORE PUSHING ANY CHANGES YOU MAKE TO THE PUBLIC REPO!!!**
```
npm run encrypt
```

*Run these commands once `config.js` has been decrypted*
```javascript
// Install dependencies from inside the ClimateMonitorV2/ClimateMonitorV2 directory
npm install

// Run the website from inside the ClimateMonitorV2/ClimateMonitorV2 directory
npm start
```
## Running tests
1. First run the app using `npm start`
2. Run the tests using `npm t`
