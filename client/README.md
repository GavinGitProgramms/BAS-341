# 🐟 BAS Client

Welcome to the BAS Client, the front-end component of the Booking Appointments Software (BAS). This client is a dynamic and responsive web application developed using modern technologies like React, TailwindCSS, and Vite.

## 🎣 Getting Started

To get started with the BAS Client, you need to have Node.js installed on your machine. Follow these steps to set up the project locally:

1. Clone the BAS repository.
2. Navigate to the `client` directory.
3. Install the dependencies:

   `npm install`

## 🎣 Available Scripts

In the project directory, you can run several scripts:

- **Local Development Server**: Starts the app in development mode using local API settings.

  `npm run dev:local`

- **API Development Server**: Starts the app in development mode using the API deployed at `https://bas.zxai.io`.

  `npm run dev:api`

- **Build**: Compiles the app for production to the `dist` folder.

  `npm run build`

- **Serve**: Serves the production build from the `dist` folder.

  `npm run serve`

- **Lint**: Runs ESLint to identify and report on patterns in TypeScript and JSX.

  `npm run lint`

- **Format**: Formats code using Prettier.

  `npm run format`

## 🎣 Dependencies

The client uses various dependencies for efficient and robust web development:

- **React & React DOM**: For building user interfaces.
- **Axios**: For making API requests.
- **date-fns**: For handling dates and times.
- **TailwindCSS & daisyUI**: For styling.
- **Vite**: As a build tool and development server.
- ... and others (see `package.json` for a full list).

## 🎣 Development Dependencies

Development dependencies include:

- **ESLint & Prettier**: For maintaining code quality and consistency.
- **TypeScript**: For adding type safety to JavaScript.
- **@vitejs/plugin-react**: To integrate React with Vite.
- ... and others (refer to `package.json`).

## 🎣 Coding Standards

This project adheres to certain coding standards for consistency and maintainability:

- **ESLint**: Follows ESLint recommended rules along with React-specific hooks rules.
- **Prettier**: Uses Prettier for code formatting with specific rules such as no semicolons, single quotes, etc. (see `package.json` for details).
- **TypeScript**: All code is written in TypeScript, leveraging its type safety features.

## 🎣 Additional Notes

- Make sure to check the `.eslintConfig` and `prettier` configurations in the `package.json` for understanding the coding style and standards.
- Always run the linter and formatter before committing changes to ensure code quality.
