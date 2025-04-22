
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

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/nivethamagesh66/Web-Based-Bug-Tracking-System.git
```

---

### 2. Frontend Setup (React)

```bash
cd Frontend
npm install
npm start
```

---

### 3. Backend Setup (Spring Boot)

1. Open `/Backend` in IntelliJ IDEA or your preferred IDE.

2. Create `application.properties` inside `/src/main/resources` with your MySQL configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bughound
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

jwt.secret=your_jwt_secret_key
```

3. Run the application using Maven:

```bash
cd Backend
./mvnw spring-boot:run
```

Or directly run the main class in IntelliJ:
```
com.example.bughound.BughoundApplication
```

---

### 4. Database Setup

- Ensure MySQL is running on your system
- Create a database named `bughound`:
```sql
CREATE DATABASE bughound;
```

- Spring Boot will auto-create tables based on JPA entities

---
