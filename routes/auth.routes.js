import { Router } from "express";
import * as authControllers from "../controllers/auth.controllers.js"

const router = Router();


router.route("/register").get(authControllers.getRegisterPage).post(authControllers.postRegisterPage)
router.route("/login").get(authControllers.getLoginPage).post(authControllers.postLoginPage)

router.route("/logout").get(authControllers.logoutUser)
router.route("/profile").get(authControllers.getUserProfile)

router.route("/verify-email").get(authControllers.getVerifyUserEmailPage)

router.route('/send-verification-link').post(authControllers.postEmailVerificationLink)

router.route('/verify-email-token').get(authControllers.getverifyEmailToken)

router.route('/edit-profile').get(authControllers.getEditProfilePage).post(authControllers.postEditProfilePage)

router.route('/change-password').get(authControllers.getChangePasswordPage).post(authControllers.postChangePasswordPage)

router.route('/delete-account').get(authControllers.getDeleteAccountPage)


export const authRoutes = router;