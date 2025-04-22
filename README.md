# Web-Based Bug Tracking System (Bug Hound)

This is a full-stack web application for tracking software bugs, built with a **React frontend** and a **Spring Boot backend**, using **MySQL** as the database.

## 🚀 Features

- User authentication with role-based access (Admin, Developer, Tester)
- Report new bugs with detailed information
- View, filter, and search bugs with multiple criteria
- Assign bugs to developers
- Track bug status and resolution history
- Upload attachments and add comments
- Activity log for bug updates and changes
- Admin panel for managing users and data

## 🔧 Tech Stack

### Frontend
- React
- JavaScript (ES6+)
- Axios
- Bootstrap / Tailwind (based on usage)

### Backend
- Spring Boot
- Java
- Spring Security (with JWT authentication)
- REST APIs

### Database
- MySQL
- JPA / Hibernate

## 📂 Folder Structure

```
/Frontend       # React application
/Backend        # Spring Boot backend
├── src
│   ├── controllers
│   ├── models
│   ├── repositories
│   ├── services
│   └── config
```

## 🧪 User Roles

| Role     | Description                         | Permissions                      |
|----------|-------------------------------------|----------------------------------|
| Admin    | Project manager                     | Full control                     |
| Developer | Assigned to fix bugs                | Edit assigned bugs only          |
| Tester   | Reports new bugs                    | View and report bugs             |

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/nivethamagesh66/Web-Based-Bug-Tracking-System.git
```

### 2. Frontend Setup

```bash
cd Frontend
npm install
npm start
```

### 3. Backend Setup

- Open `/Backend` in IntelliJ or your preferred IDE
- Create a `application.properties` file with your MySQL config
- Run the application

### 4. Database Setup

Create a MySQL database and run schema files if provided.


