
import { Router } from "express"
import { postURLShortener, getShortenerPage,
     redirectShortURL, getEditShortCodePage,
     postEditShortCodePage,
     deleteShortLink
 } from "../controllers/postshortner.controller.js"

const router = Router();


router.route('/').get(getShortenerPage).post(postURLShortener)

router.route("/:shortCode").get(redirectShortURL)

router.route("/edit/:id").get(getEditShortCodePage).post(postEditShortCodePage)

router.route("/delete/:id").post(deleteShortLink)


export const shortenerRoutes = router;