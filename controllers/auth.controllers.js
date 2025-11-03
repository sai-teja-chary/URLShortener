import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";
import {
    createSession,
    deleteUserSessions,
    findEmailToken,
    findUserById,
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    loadUser,
    saveUser,
    sendNewVerificationLink,
    updateUserEmailVerified,
    updateUserName,
    updateUserPassword,
    verifyPassword
} from "../services/auth.services.js";
import { changePasswordSchema, userRegisterSchema } from "../validators/auth-validators.js";

export const getRegisterPage = async (req, res) => {
    if (req.user) return res.redirect('/');
    return res.render("auth/register", { errors: req.flash("errors") });
};

export const getLoginPage = async (req, res) => {
    if (req.user) return res.redirect('/');
    return res.render("auth/login", { errors: req.flash("errors"), notify: req.flash("notify") });
};

export const postRegisterPage = async (req, res) => {
    try {
        if (req.user) return res.redirect('/');

        const result = userRegisterSchema.safeParse(req.body);
        if (!result.success) {
            const errorMessage = result.error.issues[0].message;
            req.flash("errors", errorMessage);
            return res.redirect("/register");
        }

        const { username, email, password } = result.data;
        const user = await loadUser(email);

        if (user) {
            req.flash("errors", "Email already exists");
            return res.redirect("/register");
        }

        const hashedPassword = await hashPassword(password);
        await saveUser({ username, email, password: hashedPassword });
        return res.redirect('/login');
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

export const postLoginPage = async (req, res) => {
    try {
        if (req.user) return res.redirect('/');

        const { email, password } = req.body;
        const user = await loadUser(email);

        if (!user) {
            req.flash("errors", "Invalid Email or Password");
            return res.redirect('/login');
        }

        const isPasswordValid = await verifyPassword(user.password, password);
        if (!isPasswordValid) {
            req.flash("errors", "Invalid Email or Password");
            return res.redirect('/login');
        }

        const session = await createSession({
            userId: user.id,
            ip: req.clientIp,
            userAgent: req.headers["user-agent"]
        });

        const accessToken = generateAccessToken({
            id: user.id,
            name: user.username,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            sessionId: session.id
        });

        const refreshToken = generateRefreshToken(session.id);
        const baseConfig = { httpOnly: true, secure: true };

        res.cookie("access_token", accessToken, { ...baseConfig, maxAge: ACCESS_TOKEN_EXPIRY });
        res.cookie("refresh_token", refreshToken, { ...baseConfig, maxAge: REFRESH_TOKEN_EXPIRY });

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

export const logoutUser = async (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    await deleteUserSessions(req.user.id);
    res.redirect('/login');
};

export const getUserProfile = (req, res) => {
    if (!req.user) {
        req.flash("errors", "Please Login!");
        return res.redirect("/login");
    }

    const user = req.user;
    res.render('profile', {
        user: {
            name: user.username,
            email: user.email,
            isEmailVerified: user.isEmailVerified
        }
    });
};

export const getVerifyUserEmailPage = async (req, res) => {
    if (!req.user) {
        req.flash("errors", "Please Login!");
        return res.redirect("/login");
    }

    const user = await findUserById(req.user.id);
    if (!user || user.isEmailVerified) return res.redirect('/');

    res.render("auth/verify-email", { email: req.user.email });
};

export const postEmailVerificationLink = async (req, res) => {
    if (!req.user) {
        req.flash("errors", "Please Login!");
        return res.redirect("/login");
    }

    const user = await findUserById(req.user.id);
    if (!user || user.isEmailVerified) return res.redirect('/');

    await sendNewVerificationLink({ email: user.email, userId: user.id });
    res.redirect('/verify-email');
};

export const getverifyEmailToken = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).send("Missing verification token");

        const [record] = await findEmailToken(token);
        if (!record) return res.status(400).send("Invalid or expired token");

        await updateUserEmailVerified(record.userEmail, record.userId);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        await deleteUserSessions(req.user.id);

        req.flash("notify", "Account Verified, Please Login again");
        res.redirect("/login");
    } catch (err) {
        console.error("Email verification error:", err);
        res.status(500).send("Something went wrong while verifying your email");
    }
};

export const getEditProfilePage = (req, res) => {
    if (!req.user) {
        req.flash("errors", "Please Login!");
        return res.redirect("/login");
    }

    res.render("auth/edit-profile", { name: req.user.username, errors: req.flash("errors"), success: req.flash("success") });
}

export const postEditProfilePage = async (req, res) => {
    if (!req.user) {
        req.flash("errors", "Please Login!");
        return res.redirect("/login");
    }

    const { name } = req.body; // <-- get data from req.body, not req.params

    if (!name || name.trim() === "") {
        req.flash("errors", "Username cannot be empty!");
        return res.redirect("/edit-profile");
    }

    await updateUserName(name, req.user.id);

    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
}


export const getChangePasswordPage = (req, res) => {
    if (!req.user) {
        req.flash("errors", "Please Login!");
        return res.redirect("/login");
    }

    res.render("auth/change-password", { errors: req.flash("errors") })
}

export const postChangePasswordPage = async (req, res) => {
    if (!req.user) {
        req.flash("errors", "Please Login!");
        return res.redirect("/login");
    }

    const result = changePasswordSchema.safeParse(req.body)

    if (!result.success) {
        console.log(result.error)
        const errorMessage = result.error.issues[0].message;
        console.log(errorMessage)
        req.flash("errors", errorMessage);
        return res.redirect("/change-password");
    }

    const {currentPassword, newPassword} = result.data

    const user = await findUserById(req.user.id)

    if (!user) {
            req.flash("errors", "Invalid user, Please Login and try again");
            return res.redirect('/login');
        }

    const currentPasswordMatched = await verifyPassword(user.password, currentPassword)

    if (!currentPasswordMatched){
        req.flash("errors", "Invalid Current Password")
        res.redirect("/change-password")
    }

    const hashedNewPassword = await hashPassword(newPassword)

    await updateUserPassword(req.user.id, hashedNewPassword)

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    await deleteUserSessions(req.user.id);

    req.flash("notify", "Password Updated, Please Login again");
    res.redirect("/login");
}


export const getDeleteAccountPage = (req, res) => {
    if (!req.user) {
        req.flash("errors", "Please Login!");
        return res.redirect("/login");
    }

    res.render("auth/delete-account")
}