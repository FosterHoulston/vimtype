# Vimtype Self Hosting

<!-- TOC ignore:true -->

## Table of contents

<!-- TOC -->

- [Vimtype Self Hosting](#vimtype-self-hosting)
    - [Table of contents](#table-of-contents)
    - [Prerequisites](#prerequisites)
    - [Quickstart](#quickstart)
    - [Account System](#account-system)
        - [Setup Firebase](#setup-firebase)
        - [Update backend configuration](#update-backend-configuration)
        - [Setup Recaptcha](#setup-recaptcha)
        - [Setup email optional](#setup-email-optional)
    - [Enable daily leaderboards](#enable-daily-leaderboards)
    - [Configuration files](#configuration-files)
        - [env file](#env-file)
        - [serviceAccountKey.json](#serviceaccountkeyjson)
        - [backend-configuration.json](#backend-configurationjson)

<!-- /TOC -->


## Prerequisites
- you need to have `docker` and `docker-compose-plugin` installed. Follow the [docker documentation](https://docs.docker.com/compose/install/) on how to do this.

## Quickstart

- create a new directory (e.g. `vimtype`) and navigate into it.
- copy `docker/docker-compose.yml` from this repository into the directory.
- create an `.env` file by copying `docker/example.env` from this repository.
- copy `docker/backend-configuration.json` from this repository.
- run `docker compose up -d`
- after the command exits successfully you can access [http://localhost:8080](http://localhost:8080)


## Account System

By default, user sign-up and login are disabled. To enable this, you'll need to set up a Firebase project. 
Stop the running docker containers using `docker compose down` before making any changes.

### Setup Firebase

- create a [Firebase](https://firebase.google.com/) account
- create a [new Firebase project](https://console.firebase.google.com/u/0/).
  - name "vimtype"
  - uncheck "enable google analytics"
- enable authentication
  - open the [firebase console](https://console.firebase.google.com/) and open your project
  - go to `Authentication > Sign-in method`  
  - enable `Email/Password` and save
- whitelist your domain
  - In the Firebase console, go to `Authentication > Sign-in method`
  - Scroll to `Authorized domains`
  - Click `Add domain` and enter the domain where you’ll host the Vimtype frontend (e.g. `localhost`)
- generate service account
  - go to your project settings by clicking the `⚙` icon in the sidebar, then `Project settings`
  - navigate to the `Service accounts` tab
  - click `Generate new private key` to download the `.json` file.
  - save it as `serviceAccountKey.json`
  - update `docker-compose.yml` and uncomment the volume block in the backend service to mount the Firebase service account:
    ```yaml
      #uncomment to enable the account system, check the SELF_HOSTING.md file
      - type: bind
        source: ./serviceAccountKey.json
        target: /app/backend/src/credentials/serviceAccountKey.json
        read_only: true
    ```

- update the `.env` file
  - open the [firebase console](https://console.firebase.google.com/) and open your project
  - open the project settings by clicking the `⚙` icon on the sidebar and `Project settings`
  - if your project has no apps yet, create a new Web app (`</>` icon)
    - nickname `vimtype`
    - uncheck `set up firebase hosting`
    - click `Register app` 
   - select your app and select `Config` for `SDK setup and configuration`
   - it will display something like this:
        ```
        const firebaseConfig = {
        apiKey: "AAAAAAAA",
        authDomain: "vimtype-00000.firebaseapp.com",
        projectId: "vimtype-00000",
        storageBucket: "vimtype-00000.appspot.com",
        messagingSenderId: "90000000000",
        appId: "1:90000000000:web:000000000000"
        };
        ```
   - update the `.env` file with the values above:
        ```
        FIREBASE_APIKEY=AAAAAAAA
        FIREBASE_AUTHDOMAIN=vimtype-00000.firebaseapp.com
        FIREBASE_PROJECTID=vimtype-00000
        FIREBASE_STORAGEBUCKET=vimtype-00000.appspot.com
        FIREBASE_MESSAGINGSENDERID=90000000000
        FIREBASE_APPID=1:90000000000:web:000000000000
        ```

### Update backend configuration

- update the `backend-configuration.json` file and add/modify
    ```json
    {
        "users": {
            "signUp": true,
            "profiles": {
                "enabled": true
            }
        }
    }
    ```

### Setup Recaptcha

- [create](https://www.google.com/recaptcha/admin/create) a new recaptcha token
    - label: `vimtype`
    - type: v2
    - domain: the domain of the frontend 
- update the `.env` file with the site key from the previous step
    ```
    RECAPTCHA_SITE_KEY="your site key"
    RECAPTCHA_SECRET="your secret key"
    ``` 

If you host privately you can use these defaults:
```
RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

### Setup email (optional)

To enable emails for password reset and email verification update the following config in `.env` file:

```
# email server config
# uncomment below if you want to send emails for e.g. password reset
EMAIL_HOST=mail.myserver   # your mailserver domain
EMAIL_USER=mailuser        # username to authenticate with your mailserver
EMAIL_PASS=mailpass        # password for the user
EMAIL_PORT=465             # port, likely 465 or 587
EMAIL_FROM="Support <noreply@myserver>"
``` 

## Enable daily leaderboards

To enable daily leaderboards update the `backend-configuration.json` file and add/modify
```json
{
    "dailyLeaderboards": {
        "enabled": true,
        "maxResults": 250,
        "leaderboardExpirationTimeInDays": 1,
        "validModeRules": [
            {
                "language": "english",
                "mode": "time",
                "mode2": "15"
            },
            {
                "language": "english",
                "mode": "time",
                "mode2": "60"
            }
        ]
    }
}
```

- language is one of the supported language
- mode can be `time` or `words`
- mode2 can be `15`,`30`,`60` or `120` if you picked `mode=time` or `10`,`25`,`50` or `100` if you picked `mode=words`.

## Configuration files

### env file

All settings are described in `docker/example.env`.

### serviceAccountKey.json

Contains your firebase config, only needed if you want to allow users to signup.

### backend-configuration.json

Configuration of the backend. Check `backend/src/constants/base-configuration.ts` for possible values.

> [!NOTE]
> Configuration changes are applied only on container startup. You must restart the container for your updates to take effect. 
