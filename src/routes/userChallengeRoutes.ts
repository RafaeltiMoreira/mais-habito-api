import { Router } from "express";
import { userChallengeController } from "../controllers/userChallenge.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.use(authMiddleware);

router.post("/accept", userChallengeController.acceptChallenge);
router.get("/active", userChallengeController.getActiveChallenge);
router.get("/", userChallengeController.listChallenges);
router.put("/:id/complete", userChallengeController.completeChallenge);
router.put("/:id/abandon", userChallengeController.abandonChallenge);
router.put("/:id/notes", userChallengeController.updateNotes);

export default router;
