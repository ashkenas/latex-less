# latex-less
Make your homework look nice without learning the nuances of LaTeX.
Final project for CS-554

## Installation
### Dependencies
- A MongoDB instance
- A Firebase Authentication project
- A LaTeX installation (tested with [MikTex](https://miktex.org/howto/download-miktex))
  - Either configure the LaTeX package manager to auto-install packages on-demand, or install the following packages manually:
    - fancyhdr
    - inputenc
    - csquotes
    - amsmath
    - amssymb

### Environment Setup
Both the client and server need a `.env` file places in their respective folders (`client` and `server`). The values that these variables will take on come from the Firebase console and the Google IAM console.

The server needs the following variables:

Variable | Type | Value
-|-|-
MONGO_CONN_STRING|string|A mongo connection string
MONGO_DB_NAME|string|The name of the database to use
GOOGLE_APPLICATION_CREDENTIALS|string|A file path to a JSON file with a google service account credentials (service account must have permission to read firebase authentication information)

The client needs the following variables:

Variable | Type | Value
-|-|-
REACT_APP_FIREBASE_KEY|string|Firebase key
REACT_APP_FIREBASE_DOMAIN|string|Firebase domain
REACT_APP_FIREBASE_PROJECT_ID|string|Firebase project id
REACT_APP_FIREBASE_STORAGE_BUCKET|string|Firebase storage bucket
REACT_APP_FIREBASE_SENDER_ID|string|Firebase sender id
REACT_APP_FIREBASE_APP_ID|string|Firebase app id
REACT_APP_BACKEND|string|URL to graphql/latex backend

The Firebase values can all be located in the Firebase console under project settings.

### Steps

After MongoDB has been installed and configured, and LaTeX has been installed, the following steps walk through installing and running this project:

1. Clone this repo
2. Open a terminal at the repo's root folder
3. Run `npm i`
4. Run `cd server`
5. Run `npm i`
6. Run `cd ../client`
7. Run `npm i --legacy-peer-deps`
8. Run `cd ..`
9. Run `npm start`

## Seeding
To seed the test user, use these steps:

1. Open the cloned repo in a terminal
2. Run `npm run seed --prefix server`