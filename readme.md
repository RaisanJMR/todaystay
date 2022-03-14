# todaystay API

> Backend API for Hotel info search application ```todaystay```, which gives you information about Hotels

## Usage

create ```config/config.env``` in root and update the following values/settings in  ```config/config.env.env``` to your own

```
NODE_ENV=development
PORT=5000

MONGO_URI='your mongodb uri'

GEOCODER_PROVIDER=mapquest
GEOCODER_API_KEY='your mapquest api key'

FILE_UPLOAD_PATH=./public/uploads
MAX_FILE_UPLOAD=1000000

JWT_SECRET='your jwt secret'
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL='your smtp email key'
SMTP_PASSWORD='your smpt password'
FROM_EMAIL='your from email'
FROM_NAME='your from name'
```

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```
## Demo

For more in depth docs with sample requests, visit the [Postman Docs](https://documenter.getpostman.com/view/8886902/UVC3jnkP)
and replace ```{{URL}}``` with [https://todaystay.herokuapp.com/](https://todaystay.herokuapp.com/)

- Version: 1.0.0
- License: MIT
- Author: JALAL MOHAMMED RAISAN

## License

The MIT License

Copyright (c) 2021 JMR

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction,expect not to spam this app while using live, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.