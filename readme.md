# 🔗 URL Shortener

A full-featured **URL Shortening Application** built using **Node.js**, **Express**, **EJS**, and **Drizzle ORM**.  
It allows users to register, log in, and manage their shortened URLs from a personalized dashboard.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Register, login, password reset, and email verification.
- 🔗 **Short Link Creation**
  - Generate unique short URLs for any valid long link.
- 🧾 **User Dashboard**
  - View, edit, and delete your shortened links.
- 📧 **Email Integration**
  - MJML templates for verification and password reset emails.
- 🧩 **Modular Architecture**
  - Clear separation of routes, controllers, and services.
- 💾 **Database Integration**
  - Drizzle ORM used for schema management and persistence.

---

## 🗂️ Folder Structure

```
URLShortener/
│
├── app.js                      # Main entry point
├── drizzle.config.js            # ORM config
├── config/                      # Database and constants
├── controllers/                 # Business logic
├── routes/                      # Express route definitions
├── services/                    # Core functionalities
├── models/                      # Drizzle ORM models
├── validators/                  # Input validation logic
├── middleware/                  # Auth verification middleware
├── emails/                      # MJML templates
├── lib/                         # Utility scripts for mailing
├── views/                       # EJS templates for UI
├── public/                      # Static files (CSS, images)
└── data/                        # Local data or sample files
```

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Templating:** EJS  
- **Database:** Drizzle ORM (SQL/SQLite/PostgreSQL)  
- **Styling:** CSS  
- **Email Templates:** MJML  
- **Tools:** dotenv, Nodemon, bcrypt, JWT

---


