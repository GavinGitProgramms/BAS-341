# bas-db

## Introduction

This project serves as both a client library for accessing the `bas-db` and a way to create and apply database schema migrations.

## Getting Started

### Install Dependencies

```
npm install
```

### Build and Bundle the Library

```
npm run prepare
```

### Start the Database Container

```
docker-compose up -d
```

### Apply all Migrations to the Database

```
npm run typeorm migration:run -- -d ./dist/index.js
```

## Managing Database Migrations

### Add a New Database Migration

```
npm run prepare
npm run typeorm migration:generate -- -d ./dist/index.js ./src/migration/Migration
npm run format
```
