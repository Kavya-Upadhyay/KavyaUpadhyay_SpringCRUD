# Student Management System

A modern, responsive full-stack CRUD application built with Spring Boot, Spring JDBC, PostgreSQL, and Vanilla web technologies (HTML, CSS, JS).

## 🚀 Features

- **Create:** Add new students with details (Name, Email, Course)
- **Read:** View a list of all students with search functionality
- **Update:** Edit existing student details
- **Delete:** Remove a student from the database with confirmation modal
- **Modern UI:** Glassmorphism UI, animated background, toast notifications
- **Responsive:** Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.5**
- **Spring Boot Starter JDBC**
- **PostgreSQL** (Database)

### Frontend
- **HTML5**
- **Vanilla CSS3** (Custom styling with modern properties)
- **Vanilla JavaScript** (DOM manipulation and fetch API)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- Java 17 or higher
- Maven
- PostgreSQL

## ⚙️ Setup & Installation

1. **Clone the repository** (if applicable) or extract the project files.

2. **Database Setup**
   - Open your PostgreSQL client (pgAdmin, psql, etc.).
   - Create a new database named `studentdb`:
     ```sql
     CREATE DATABASE studentdb;
     ```
   - Make sure your postgres user matches the credentials in `src/main/resources/application.properties`. Default credentials used:
     - Username: `postgres`
     - Password: `1234`
     - Database URL: `jdbc:postgresql://localhost:5432/studentdb`

3. **Build the Project**
   Navigate to the project root directory and run:
   ```bash
   mvn clean install
   ```

4. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```
   *(Note: The application automatically initializes the database schema upon startup as configured in `application.properties`)*

5. **Access the Application**
   Open your web browser and navigate to:
   [http://localhost:8080](http://localhost:8080)

## 🔌 API Endpoints

The application exposes the following RESTful endpoints under `/students`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/students` | Get all students |
| `GET` | `/students/{id}` | Get a single student by ID |
| `POST` | `/students` | Create a new student |
| `PUT` | `/students/{id}` | Update an existing student |
| `DELETE` | `/students/{id}` | Delete a student |

## 📁 Project Structure

- `src/main/java/.../model/` - Contains the `Student` entity class
- `src/main/java/.../repository/` - Contains the JDBC data access logic
- `src/main/java/.../service/` - Contains the business logic layer
- `src/main/java/.../controller/` - Contains the REST API endpoints
- `src/main/resources/application.properties` - Database and application configuration
- `src/main/resources/schema.sql` - Database schema initialization
- `src/main/resources/static/` - Contains frontend HTML, CSS, and JS files

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
