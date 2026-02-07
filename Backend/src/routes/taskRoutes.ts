import { Router } from 'express';
import { updateTaskOnDragEnd, createTaskForProject } from '../controller/tasksController';
import { asyncHandler } from '../middleware/asyncHandler';


const router = Router();

router.patch('/updateTaskOnDragEnd', asyncHandler(updateTaskOnDragEnd as any));

router.post('/createTask', asyncHandler(createTaskForProject as any));


export default router;