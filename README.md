# Natours Tours Management (Node.js MVC)

**Status:** 🚧 _This project is still under development!_

## Project Overview

This is my first Node.js project, designed to help me improve my backend development skills.  
The application is a Tours Management system built using the **MVC (Model-View-Controller) architecture**.

## Features

- Built with Node.js, Express, and MongoDB (via Mongoose)
- Environment-based configuration (development/production)
- Modular code structure (controllers, models, routes)
- Uses dotenv for environment variables

## Getting Started

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd <project-folder>
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Edit the `config.env` file with your own MongoDB credentials and desired port.  
Example:

```
ENV_TYPE=dev
DATABASE_PASSWORD=your_password
PORT=3000
DATABASE=mongodb+srv://<username>:<PASSWORD>@cluster0.mongodb.net/natours?retryWrites=true&w=majority
DATABASE_LOCAL=mongodb://localhost:27017/natours
```

### 4. Running the Project

#### Development Mode

Runs the server with **nodemon** for automatic restarts on file changes.

```sh
npm run start:dev
```

#### Production Mode

Runs the server with the `ENV_TYPE` set to `production`.

```sh
npm run start:prod
```

> **Note:**
>
> - Make sure your environment variables in `config.env` are set correctly for production.
> - The production script uses `cross-env` to set environment variables in a cross-platform way.

---

## Scripts from `package.json`

| Script     | Description                                 |
| ---------- | ------------------------------------------- |
| start:dev  | Starts server in development mode (nodemon) |
| start:prod | Starts server in production mode            |
| test       | Placeholder for tests                       |

---

## Project Structure

```
.
├── Controllers/      # Controller files (business logic)
├── dev-data/         # Sample data and images
├── models/           # Mongoose models
├── public/           # Static assets (CSS, images)
├── tourRoutes/       # Tour-related routes
├── userRoutes/       # User-related routes
├── app.js            # Express app setup
├── server.js         # Entry point
├── config.env        # Environment variables
└── package.json      # Project metadata and scripts
```

---

## License

ISC

---

Let me know if you want to add more sections or details!
