import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import * as Controller from "../controllers/controller.js";

const router = express.Router();

router.route("/signup").post(Controller.signup);
router.route("/login").post(Controller.login);

router.route("/profiles").get(authMiddleware, Controller.getAllProfiles);

router.route("/profile/:id").get(authMiddleware, Controller.getProfile);

router.route("/update/:id").put(authMiddleware, Controller.updateProfile);

router.route("/delete/:id").delete(authMiddleware, Controller.deleteProfile);

router.route("/logout").post(authMiddleware, Controller.logout);

export default router;