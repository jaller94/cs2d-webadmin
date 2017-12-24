# CS2D Webadmin
Web-based administration interface for CS2D gaming server for Linux

[![Maintainability](https://api.codeclimate.com/v1/badges/1aa4bfbd72be3ccc345a/maintainability)](https://codeclimate.com/github/jaller94/cs2d-webadmin/maintainability)

## First start
1. Create a folder `server`.
2. Copy your CS2D server into the folder `server`.
3. Download the Linux Dedicated server zip package from http://cs2d.com.
4. Unpack the linux server into the folder `server`.
5. Make sure the file `cs2d_dedicated` executable (e.g. using `chmod +x server/cs2d_dedicated`.
6. Install the dependencies: `npm install`

## How to start the server
1. Start the web server: `npm start`
2. Open http://localhost:3000 in your browser.
3. Log in using credentials from `db/users.js`.
4. Press the button "Start server".
