import { Router } from "express";
import { taskCompletionController } from "../controllers/taskCompletion.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.use(authMiddleware);

router.post("/", taskCompletionController.completeTask);

export default router;