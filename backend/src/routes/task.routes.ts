import { Router } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validateBody, validateParams } from "../middlewares/validation.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
} from "../schemas/task.schema";

const router = Router();

// All routes are protected
router.use(authenticate);

router.get("/", getTasks);
router.get("/:id", validateParams(taskIdSchema), getTaskById);
router.post("/", validateBody(createTaskSchema), createTask);
router.put("/:id", validateParams(taskIdSchema), validateBody(updateTaskSchema), updateTask);
router.delete("/:id", validateParams(taskIdSchema), deleteTask);
router.patch("/:id/toggle", validateParams(taskIdSchema), toggleTask);

export default router;
