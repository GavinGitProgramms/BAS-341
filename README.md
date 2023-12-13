# 🐟 Booking Appointments Software (BAS)

Welcome to BAS, the Booking Appointments Software, a solution designed to streamline the process of creating and managing appointments. Whether you are a service provider looking to schedule sessions with clients or an individual seeking to book appointments effortlessly, BAS offers a user-friendly platform to cater to your needs.

## 🎣 Features

BAS is built with a host of features to enhance user experience and administrative efficiency:

- **Service Provider Functionality**: Allows service providers to create and manage appointments with ease.
- **User-Friendly Booking**: Empowers regular users to book appointments through a seamless interface.
- **Admin Capabilities**: Enables administrators to search appointments, generate detailed reports, and manage user accounts.
- **Responsive Web Client**: Developed using TypeScript and React, ensuring a dynamic and responsive user interface.
- **Stylish UI with Dark Theme**: Incorporates TailwindCSS and daisyUI with a dark theme for a modern and accessible design.
- **Secure and Efficient Backend**: The server, written in TypeScript and Node.js, offers a robust and secure RESTful API using express.js.
- **Session Management**: Utilizes express session for managing authentication sessions efficiently.
- **Database Management Library (`bas-db`)**: A dedicated Node library for handling database schema, connections, migration, and seeding.

## 🎣 Technologies

BAS harnesses the power of modern web technologies to provide a high-quality user experience:

- **Frontend**: TypeScript, React, Vite, TailwindCSS, daisyUI
- **Backend**: TypeScript, Node.js, Express.js, express session
- **Database Management**: `bas-db` library for database operations

## 🎣 Terminology

In BAS, several key terms and concepts are integral to understanding the structure and functionality of the software:

### Entities

1. **User**: Represents individuals using the BAS application. Users are categorized into three types: Regular, Service Provider, and Admin.

   - `UserType`: Enumerates these user types.
   - `User`: A class that encapsulates user attributes such as username, type, qualifications, and contact information.

2. **Appointment**: Core entity representing a scheduled event.

   - `AppointmentType`: Enumerates types of appointments like Beauty, Fitness, and Medical.
   - `Appointment`: A class detailing the appointment's specifics, including type, provider, user, and timing.

3. **Qualification**: Represents credentials or skills of a service provider.

   - `Qualification`: A class containing details about a service provider's qualifications.

4. **Notification**: Used for informing users about various events or updates.

   - `NotificationType`: Enumerates notification delivery types such as App, SMS, and Email.
   - `Notification`: A class containing notification details including type, message, and status (viewed/unviewed).

5. **Event**: Represents significant occurrences within the system, primarily related to appointments.
   - `EventType`: Enumerates event types related to appointment lifecycle events.
   - `Event`: A class capturing details of an event, including type and associated data.

### Components

1. **Client**: Refers to the web client of BAS, developed using TypeScript, React, and Vite, and styled with TailwindCSS and daisyUI (dark theme).

2. **Server**: The server component of BAS, written in TypeScript and Node.js. It provides a RESTful API using express.js and manages authentication sessions with express session.

3. **bas-db**: A shared Node library used by BAS for database-related operations. It contains the schema, database connections, utilities for interacting with the database, and code for database migrations and seeding.

## 🎣 Project Structure

The BAS project is organized into three primary directories, each serving a specific role in the application's architecture:

### `client`

The `client` directory contains the source code and assets for the web client of BAS.

- **public**: Publicly accessible files, such as HTML templates and global assets.
- **scripts**: Custom scripts for tasks like building or deploying the client.
- **src**: The source code for the web client.
  - **api**: Functions for making API requests to the server.
  - **components**: React components used throughout the web client.
  - **hooks**: Custom React hooks for shared logic across components.
  - **images**: Image files used in the client application.
  - **layout**: Components and styles defining the layout of the application.
  - **pages**: Components representing entire pages in the application.
  - **providers**: Context providers for state management in React.
  - **styles**: CSS and TailwindCSS stylesheets for the application.
  - **types**: TypeScript type definitions specific to the client.
  - **utils**: Utility functions shared across the client application.

### `db` (bas-db)

The `db` directory, also known as `bas-db`, contains the database management library.

- **scripts**: Custom scripts for database-related tasks.
- **src**: Source code for the database management.
  - **entity**: Entity classes for database tables.
  - **migration**: Scripts for database migrations.
  - **types**: TypeScript type definitions for the database.
  - **utils**: Utility functions for database operations.

### `server`

The `server` directory contains the backend code of BAS.

- **public**: Publicly accessible files served by the server.
- **src**: Source code for the server.
  - **middleware**: Middleware functions for the server.
  - **routers**: Definitions of API routes and their handlers.
  - **types**: TypeScript type definitions specific to the server.
  - **utils**: Utility functions shared across the server application.

This structure is designed to keep the client, server, and database concerns separated, allowing for more manageable and modular development. Each directory is equipped with its own scripts, and source code, ensuring a clear and organized workflow.

## 🎣 Testing

### Manual Testing

In the current state of BAS, testing has been conducted manually to ensure the reliability and functionality of each API endpoint and utility function.

- **API Endpoints**: Each endpoint in the server component has been thoroughly tested for various scenarios, including successful requests, error handling, and edge cases. This process involved manually sending requests and verifying the responses against expected outcomes.
- **Utility Functions**: Utility functions in both the `client` and `server` components, as well as the `bas-db` library, have been tested manually. This included executing these functions with different inputs to validate their behavior and outputs.

While all testing has been manual for BAS so far, we would recommend automated testing for future developments.

## 🎣 Additional Documentation

In addition to this main `README.md`, there is detailed documentation provided in each of the three main component directories of the BAS project:

- **Client (`client/README.md`)**: Contains instructions for setting up, running, and building the client application. This includes details on dependencies, environment setup, and commands for development and production builds.
- **Server (`server/README.md`)**: Offers comprehensive guidance on how to get the server up and running. This README also includes documentation for the RESTful API, detailing available endpoints, request formats, and expected responses.
- **Database (`db/README.md`)**: Provides instructions for setting up the database, running migrations, and using the `bas-db` library for database operations.

### Code Documentation

- **JSDoc**: Throughout the BAS codebase, JSDoc comments are used to document classes, functions, types, and interfaces. This provides clear, in-line documentation that helps developers understand the code's functionality and usage.
- **Code Comments**: Extensive comments throughout the codebase offer additional context and explanations, aiding in the understanding and maintainability of the code.

These additional documentation resources are integral to getting a comprehensive understanding of the BAS project, facilitating easier setup, development, and contribution for developers.
