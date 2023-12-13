# 🐟 BAS Server

Welcome to the BAS `server`, the RESTful Web API for the Booking Appointments Software (BAS). This server handles all the backend logic, database interactions, and API requests for BAS.

## 🎣 Getting Started

To set up the `server` for development, follow these steps to install dependencies, link the `bas-db` library, and start the server.

### Install NPM Dependencies

Ensure Node.js is installed on your system and then install the necessary NPM packages:

`npm install`

### Link `bas-db`

The `server` requires the `bas-db` shared library. To link it locally:

1. Navigate to the `db` directory and install its dependencies:

   ```
   cd ../db
   npm install
   npm link
   ```

2. Return to the `server` directory and link `bas-db`:

   ```
   cd ../server
   npm install
   npm link bas-db
   ```

### Start the Database

The Web API needs a PostgreSQL database. Use Docker for development:

1. Ensure `docker` and `docker-compose` or Docker Desktop are installed.
2. Start the database using:

   ```
   cd ../db
   docker-compose up -d
   ```

### Start the Server

Launch the `server` using:

`npm start`

## Available Scripts

Within the `server` directory, various scripts are available:

- **Build**: Compiles TypeScript to JavaScript.

  `npm run build`

- **Watch**: Watches for changes and compiles TypeScript files in real-time.

  `npm run watch`

- **Logs**: Displays logs if using pm2 for process management.

  `npm run logs`

- **Serve**: Starts the server using pm2.

  `npm run serve`

- **Development Mode**: Runs the server in development mode with live updates.

  `npm run dev`

- **Linting**: Checks code for stylistic and programming errors.

  `npm run lint`

- **Formatting**: Formats code according to defined standards.

  `npm run format`

## 🎣 Dependencies

The `server` relies on several key dependencies:

- **Express & Body Parser**: For handling HTTP requests.
- **CORS**: To enable cross-origin requests.
- **Express-Session**: For managing user sessions.
- **Morgan**: For HTTP request logging.
- ... and others (see `package.json` for a full list).

## 🎣 Development Standards

To maintain consistency and code quality, the `server` follows these standards:

- **TypeScript**: All server code is written in TypeScript for type safety and clarity.
- **ESLint & Prettier**: For ensuring coding best practices and uniform formatting (see `.eslintConfig` and `prettier` in `package.json`).

## 🎣 Web API

This section provides an overview of the RESTful API endpoints for the `server`.

### ✨ Auth Router (`/auth`)

This section provides an overview of the RESTful API endpoints under the `/auth` router for the `server`.

#### Register

- **URL**: `/auth/register`
- **Method**: POST
- **Description**: Handles the registration of a new user.
- **Body Parameters**:
  - `username`: The desired username of the user.
  - `type`: The type of user (`REGULAR`, `SERVICE_PROVIDER`, `ADMIN`). Note: `ADMIN` cannot be registered from the client-side.
  - `first_name`: The first name of the user.
  - `last_name`: The last name of the user.
  - `email`: The email address of the user.
  - `phone_number`: The phone number of the user.
  - `password`: The password for the user.

#### Login

- **URL**: `/auth/login`
- **Method**: POST
- **Description**: Handles the login request and authenticates the user.
- **Body Parameters**:
  - `username`: The username of the user.
  - `password`: The password of the user.

#### Logout

- **URL**: `/auth/logout`
- **Method**: GET
- **Description**: Logs out the authenticated user by destroying the session.
- **Authentication Required**: Yes

#### Get Authenticated User

- **URL**: `/auth/user`
- **Method**: GET
- **Description**: Retrieves the data of the currently authenticated user.
- **Authentication Required**: Yes

#### Search Users (Admin Only)

- **URL**: `/auth/user/search`
- **Method**: GET
- **Description**: Allows searching of users based on various criteria. Available only for admins.
- **Query Parameters**:
  - `username`, `type`, `firstName`, `lastName`, `phoneNumber`, `email`: Filters for searching users.
  - `page`, `rowsPerPage`: Pagination parameters.
  - `sortField`, `sortDirection`: Sorting parameters.
  - `enabled`: Filter for user status (enabled/disabled).
- **Authentication Required**: Yes, Admin

#### Enable User (Admin Only)

- **URL**: `/auth/user/enable/:username`
- **Method**: PUT
- **Description**: Enables a user account. Available only for admins.
- **URL Parameters**:
  - `username`: The username of the user to enable.
- **Authentication Required**: Yes, Admin

#### Disable User (Admin Only)

- **URL**: `/auth/user/disable/:username`
- **Method**: PUT
- **Description**: Disables a user account. Available only for admins.
- **URL Parameters**:
  - `username`: The username of the user to disable.
- **Authentication Required**: Yes, Admin

#### Get User by Username (Admin Only)

- **URL**: `/auth/user/:username`
- **Method**: GET
- **Description**: Retrieves user data based on the username. Available only for admins.
- **URL Parameters**:
  - `username`: The username of the user to retrieve information for.
- **Authentication Required**: Yes, Admin

### ✨ Appointment Router (`/appointment`)

This section outlines the RESTful API endpoints under the `/appointment` router, responsible for handling various appointment-related operations in BAS.

#### Create Appointment

- **URL**: `/appointment`
- **Method**: POST
- **Description**: Creates a new appointment for a service provider.
- **Authentication Required**: Yes, Service Provider
- **Body Parameters**:
  - `type`: The type of appointment (`BEAUTY`, `FITNESS`, `MEDICAL`, etc.).
  - `description`: The description of the appointment.
  - `start_time`: The start time of the appointment.
  - `end_time`: The end time of the appointment.

#### Search Appointments

- **URL**: `/appointment/search`
- **Method**: GET
- **Description**: Searches for appointments based on various criteria.
- **Authentication Required**: Yes
- **Query Parameters**:
  - `userId`, `providerId`: Filters for specific users or providers.
  - `type`: Appointment type.
  - `description`: Text to match in the appointment description.
  - `startTime`, `endTime`: Time range for the appointment.
  - `canceled`: Whether to include canceled appointments.
  - `page`, `rowsPerPage`: Pagination parameters.
  - `sortField`, `sortDirection`: Sorting parameters.
  - `unbookedOnly`: Whether to include only unbooked appointments.

#### Book Appointment

- **URL**: `/appointment/book`
- **Method**: POST
- **Description**: Books an appointment for a regular user.
- **Authentication Required**: Yes, Regular User
- **Body Parameters**:
  - `id`: The ID of the appointment to book.

#### Cancel Appointment

- **URL**: `/appointment/cancel`
- **Method**: POST
- **Description**: Cancels an existing appointment.
- **Authentication Required**: Yes
- **Body Parameters**:
  - `id`: The ID of the appointment to cancel.

#### Get Appointment by ID

- **URL**: `/appointment/:appointmentId`
- **Method**: GET
- **Description**: Retrieves the details of a specific appointment by its ID.
- **Authentication Required**: Yes
- **URL Parameters**:
  - `appointmentId`: The ID of the appointment to retrieve.

### ✨ Provider Router (`/provider`)

This section describes the RESTful API endpoints under the `/provider` router, which handles operations related to service providers in BAS.

#### Create Qualification

- **URL**: `/provider/qualification`
- **Method**: POST
- **Description**: Creates a new qualification for a service provider.
- **Authentication Required**: Yes
- **Body Parameters**:
  - `description`: The description of the qualification.

### ✨ Notification Router (`/notification`)

This section details the RESTful API endpoints under the `/notification` router, which manages operations related to notifications in BAS.

#### List Notifications

- **URL**: `/notification/list`
- **Method**: GET
- **Description**: Lists all notifications for the authenticated user.
- **Authentication Required**: Yes

#### Get Notification by ID

- **URL**: `/notification/:notificationId`
- **Method**: GET
- **Description**: Retrieves a specific notification by its ID.
- **Authentication Required**: Yes
- **URL Parameters**:
  - `notificationId`: The ID of the notification to retrieve.

#### View Notification

- **URL**: `/notification/view/:notificationId`
- **Method**: POST
- **Description**: Marks a notification as viewed by the authenticated user.
- **Authentication Required**: Yes
- **URL Parameters**:
  - `notificationId`: The ID of the notification to mark as viewed.

### Report Router (`/report`)

This section outlines the RESTful API endpoint under the `/report` router, which is used for generating reports related to appointments in BAS.

#### ✨ Generate Appointment Report

- **URL**: `/report/appointment`
- **Method**: GET
- **Description**: Generates a comprehensive report of appointments based on various criteria. This report includes statistics like appointment count by type, appointment status count, average duration, appointments over time, appointment count by provider, and user participation.
- **Authentication Required**: Yes, Admin
- **Query Parameters**:
  - `userId`, `providerId`: Filters for specific users or providers.
  - `type`: Appointment type.
  - `description`: Text to match in the appointment description.
  - `startTime`, `endTime`: Time range for the appointment.
  - `canceled`: Whether to include canceled appointments.
  - `page`, `rowsPerPage`: Pagination parameters.
  - `sortField`, `sortDirection`: Sorting parameters.
  - `unbookedOnly`: Whether to include only unbooked appointments.
