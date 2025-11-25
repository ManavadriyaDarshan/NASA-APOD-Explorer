# NASA APOD Explorer

This project is a web application that allows users to explore NASA's Astronomy Picture of the Day (APOD).
It consists of a Java Spring Boot backend and a React frontend.

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- Maven (optional, mvnw wrapper not included but pom.xml is standard)

## Backend Setup (Java)

1. Navigate to the `java-backend` directory.
2. Build the project:
   ```bash
   ./mvnw clean install
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   The backend will start on `http://localhost:8080`.

   **Environment Variables:**
   You can configure the following in `application.properties` or as environment variables:
   - `NASA_API_KEY`: Get one from https://api.nasa.gov/ (Default: `DEMO_KEY`)

## Frontend Setup (React)

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   
   The frontend will start on `http://localhost:3000`.

## Features

- **Today's APOD**: View the current Astronomy Picture of the Day.
- **Gallery**: Browse recent APODs.
- **Random**: Discover random APODs from the past.
- **Search by Date**: Look up APOD for a specific date.
- **Favorites**: Save your favorite pictures (stored in-memory).

## Tech Stack

- **Backend**: Java, Spring Boot, Spring Web, Caffeine Cache
- **Frontend**: React, Tailwind CSS, Lucide React, Axios

## Credits

Designed and developed by **Darshan Manavadariya**.
