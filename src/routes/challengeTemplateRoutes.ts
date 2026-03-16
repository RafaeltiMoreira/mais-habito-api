import { Router } from "express";
import { challengeTemplateController } from "../controllers/challengeTemplate.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", challengeTemplateController.listAll);
router.get("/:id", challengeTemplateController.getById);
router.post("/", challengeTemplateController.create);
router.delete("/:id", challengeTemplateController.delete);

export default router;
