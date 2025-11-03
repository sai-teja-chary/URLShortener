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

## 🧪 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/sai-teja-chary/URLShortener.git
cd URLShortener
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables
Create a `.env` file in the root folder:
```
PORT=3000
DATABASE_URL=your_database_url_here
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password
```

### 4️⃣ Run the App
```bash
npm start
```
Visit [http://localhost:3000](http://localhost:3000)

---

## 🌱 Future Improvements

- Add analytics (track clicks and timestamps)
- Add expiry dates for short links
- Deploy on Render or Vercel with CI/CD
- Replace EJS with React frontend (Next.js)
- Add role-based access and rate limiting

---

## 🧑‍💻 Author

**Saiteja Chary**  
💼 Aspiring Full Stack Developer  
🔗 [GitHub](https://github.com/sai-teja-chary)

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you like this project, consider giving it a star!
