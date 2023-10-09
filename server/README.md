# bas-server

The Web API for BAS.

## Getting Started

### Install NPM Dependencies

```
npm install
```

### Link `bas-db`

This Web API requires the `bas-db` shared library. For now, we need to link this locally. You can do this using the following commands:

```
cd ../db
npm install
npm run prepare
npm link

cd ../server
npm link bas-db
```

### Start the Database

The Web API requires access to a PostgreSQL database. The recommended way to do this during development is to use the `docker-compose.yml` file in the `bas-db` project. Make sure you have `docker` and `docker-compose` or Docker Desktop installed if you choose this method. Then you can use the following commands to start the database:

```
cd ../db
docker-compose up -d
```

### Start the Server

```
npm start
```

## Web API

This document provides an overview of the API endpoints for the application, along with instructions for starting the server and using `curl` to test the endpoints.

### Starting the Server

Before testing the endpoints, make sure to start the server:

```
npm start
```

### Endpoints

### 1. Register

**URL**: `/auth/register`

**Method**: POST

**Description**: Handles the registration of a new user.

**Body Parameters**:

- `username`: The desired username of the user.
- `type`: The type of user (`ADMIN` or other values, note that `ADMIN` can't be registered from the client-side).
- `first_name`: The first name of the user.
- `last_name`: The last name of the user.
- `email`: The email address of the user.
- `phone_number`: The phone number of the user.
- `password`: The password for the user.

**Sample `curl` Command**:

```bash
curl -X POST http://localhost:3000/register \
     -H "Content-Type: application/json" \
     -d '{"username": "test", "type": "REGULAR", "first_name": "Foo", "last_name": "Bar", "email": "foo@bar.com", "phone_number": "+1 608 781-8181", "password": "letmein"}' \
     -c cookies.txt
```

> This command saves the session cookie to cookies.txt.

### 2. Login

**URL**: `/auth/login`

**Method**: POST

**Description**: Handles the login request and authenticates the user.

**Body Parameters**:

- `username`: The username of the user.
- `password`: The password of the user.

**Sample `curl` Command**:

```
curl -X POST http://localhost:3000/login \
     -H "Content-Type: application/json" \
     -d '{"username": "test", "password": "letmein"}' \
     -c cookies.txt
```

> This command saves the session cookie to cookies.txt.

### 3. Logout

**URL**: `/auth/logout`

**Method**: GET

**Description**: Logout handler function that destroys the session and clears the session cookie.

**Sample `curl` Command**:

```
curl -X GET http://localhost:3000/logout -b cookies.txt
```

> This command uses the session cookie from cookies.txt.

### 4. Get Appointments

**URL**: `/appointment`

**Method**: GET

**Description**: Handles the GET request to retrieve appointments for a specific user.

**Sample `curl` Command**:

```
curl -X GET http://localhost:3000/ -b cookies.txt
```

> This command uses the session cookie from cookies.txt.

