import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.use(authMiddleware);

router.post("/", taskController.createTask);
router.get("/me", taskController.listMyTasks);
router.put("/:taskId", taskController.updateTask);
router.delete("/:taskId", taskController.deleteTask);

export default router;
