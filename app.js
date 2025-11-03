import cookieParser from "cookie-parser";
import express from "express";
import flash from "connect-flash"
import requestIp from "request-ip"
import session from "express-session";

import { authRoutes } from "./routes/auth.routes.js";
import { shortenerRoutes } from "./routes/shortner.routes.js";
import { verifyAuthentication } from "./middleware/verify-auth.middleware.js";

const PORT = 3000;
const app = express();

// Middleware Setup
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ✅ FIXED: parentheses added
app.set("view engine", "ejs");

app.use(
    session({secret:"my-secret", resave: true, saveUninitialized: false})
)

app.use(flash())

app.use(requestIp.mw())

// ✅ Authentication middleware FIRST
app.use(verifyAuthentication);

// ✅ Make `user` available to all EJS views
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// ✅ Then register routes
app.use(authRoutes);
app.use(shortenerRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
