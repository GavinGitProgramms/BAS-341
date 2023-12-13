# 🐟 BAS DB

## 🎣 Introduction

`bas-db` serves as a key component in the Booking Appointments Software (BAS), functioning both as a database abstraction library and a tool for creating and applying database schema migrations. It encapsulates the database operations and provides a streamlined way to manage the database schema within the BAS ecosystem.

## 🎣 Getting Started

To begin working with `bas-db`, follow these steps to set up the environment and build the library.

### Install Dependencies

Before starting, ensure that Node.js is installed. Then, install the necessary dependencies:

`npm install`

### Build and Bundle the Library

Compile the TypeScript code to JavaScript for execution:

`npm run prepare`

### Start the Database Container

Use Docker to set up and run the database container:

`docker-compose up -d`

### Apply all Migrations to the Database

Execute all pending database migrations to update the database schema:

`npm run typeorm migration:run -- -d ./dist/index.js`

## Managing Database Migrations

`bas-db` simplifies managing database migrations, allowing for controlled schema changes and versioning.

### Add a New Database Migration

To introduce new changes to the database schema, follow these steps:

1. Generate a new migration file:

   ```
   npm run prepare
   npm run typeorm migration:generate -- -d ./dist/index.js ./src migration/Migration
   ```

2. Format the newly created migration file:

   `npm run format`

## Development Standards

The `bas-db` project adheres to specific development standards:

- **TypeScript**: All code is written in TypeScript, ensuring type safety and clarity.
- **ESLint & Prettier**: The project uses ESLint for code analysis and Prettier for consistent code formatting. Refer to the `.eslintConfig` and `prettier` settings in the `package.json` for configuration details.
