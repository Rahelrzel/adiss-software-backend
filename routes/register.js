import express from "express";
import registerController from "../controllers/registerController.js";
import registrationMiddleware from "../middelwares/registerMiddleware.js";

const router = express.Router();

router.post("/", registerController, registrationMiddleware);

export default router;
