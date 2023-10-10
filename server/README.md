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

**Sample `curl` Commands**:

#### Create a Regular User

```bash
curl -s -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username": "test", "type": "REGULAR", "first_name": "Foo", "last_name": "Bar", "email": "foo@bar.com", "phone_number": "+1 608 781-8181", "password": "letmein"}' \
     -c cookies.txt
```

#### Create a Service Provider User

```bash
curl -s -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username": "testProvider", "type": "SERVICE_PROVIDER", "first_name": "Awesome", "last_name": "Services", "email": "awesome@services.com", "phone_number": "+1 608 742-4242", "password": "letmein"}' \
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

```bash
curl -s -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "testProvider", "password": "letmein"}' \
     -c cookies.txt
```

> This command saves the session cookie to cookies.txt.

### 3. Logout

**URL**: `/auth/logout`

**Method**: GET

**Description**: Logout handler function that destroys the session and clears the session cookie.

**Sample `curl` Command**:

```bash
curl -s -X GET http://localhost:3000/auth/logout -b cookies.txt
```

> This command uses the session cookie from cookies.txt.

### 4. Get User

**URL**: `/auth/user`

**Method**: GET

**Description**: Handles the GET request to data for a specific user.

**Sample `curl` Command**:

```bash
curl -s -X GET http://localhost:3000/auth/user -b cookies.txt
```

> This command uses the session cookie from cookies.txt.

### 5. Get Booked Appointments

**URL**: `/appointment`

**Method**: GET

**Description**: Retrieves all booked appointments for a user. Requires an authenticated user for access. For use by regular users only.

**Sample `curl` Command**:

```bash
curl -s -X GET http://localhost:3000/appointment -b cookies.txt
```

> This command uses the session cookie from cookies.txt.

### 6. Get All Appointments

**URL**: `/appointment/all`

**Method**: GET

**Description**: Gets all appointments for a user, including all booked appointments for the particular user and all unbooked appointments for all service providers. Requires an authenticated user for access. For use by regular users only.

**Sample `curl` Command**:

```bash
curl -s -X GET http://localhost:3000/appointment/all -b cookies.txt
```

> This command uses the session cookie from cookies.txt.

### 7. Get Specific Booked Appointment

**URL**: `/appointment/:appointmentId`

**Method**: GET

**Description**: Handles GET requests for a specific booked appointment by ID for a given user. Requires an authenticated user for access. For use by regular users only.

**URL Parameters**:

- `appointmentId`: ID of the appointment.

**Sample `curl` Command**:

```bash
APPT_ID='0cc12562-a55c-4335-a10c-9ebc3e615902'
curl -s -X GET http://localhost:3000/appointment/$APPT_ID -b cookies.txt
```

> This command uses the session cookie from cookies.txt.

### 8. Create New Appointment

**URL**: `/appointment`

**Method**: POST

**Description**: Creates a new appointment for a service provider. Requires an authenticated user for access. For use by service provider users only.

**Body Parameters**:

- `type`: The type of appointment.
- `start_time`: The start time of the appointment.
- `end_time`: The end time of the appointment.

**Sample `curl` Command**:

```bash
curl -s -X POST http://localhost:3000/appointment \
     -H "Content-Type: application/json" \
     -d '{"type": "MEDICAL", "start_time": "2023-10-10T10:00:00Z", "end_time": "2023-10-10T11:00:00Z"}' \
     -b cookies.txt
```

### 9. Book an Appointment

**URL**: `/appointment/book`

**Method**: POST

**Description**: Handles the request to book an appointment. Requires an authenticated user for access. For use by regular users only.

**Body Parameters**:

- `id`: The ID of the appointment.

**Sample `curl` Command**:

```bash
curl -s -X POST http://localhost:3000/appointment/book \
     -H "Content-Type: application/json" \
     -d '{"id": "f3844432-be0e-4eb2-89f1-7efb7f566489"}' \
     -b cookies.txt
```

> This command uses the session cookie from cookies.txt.

```bash
curl -s -X POST http://localhost:3000/provider/qualification \
     -H "Content-Type: application/json" \
     -d '{"description": "AWESOME"}' \
     -b cookies.txt
```
