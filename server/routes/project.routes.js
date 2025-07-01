import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  authMiddleware.authUser,
  body("name").isString().notEmpty().withMessage("Name is required"),
  projectController.createProject
);
router.get("/all", authMiddleware.authUser, projectController.getAllProjects);

router.put(
  "/add-user",
  authMiddleware.authUser,
  body("projectId").isString().withMessage("Project Id is required"),
  body("users")
    .custom(
      (arr) =>
        Array.isArray(arr) &&
        arr.length > 0 &&
        arr.every((u) => typeof u === "string" && u.trim() !== "")
    )
    .withMessage("Users must be a non-empty array of non-empty strings"),
  projectController.addUserToProject
);

router.get(
  "/get-project/:projectId",
  authMiddleware.authUser,
  projectController.getProjectById
);

export default router;
