import { Router } from 'express';
import { updateTaskOnDragEnd, 
    createTaskForProject, 
    deleteTask, 
    updateTaskDetails } 
    from '../controller/tasksController';
import { asyncHandler } from '../middleware/asyncHandler';


const router = Router();

router.patch('/updateTaskOnDragEnd', asyncHandler(updateTaskOnDragEnd));

router.post('/createTask', asyncHandler(createTaskForProject));

router.delete('/deleteTask/:taskId', asyncHandler(deleteTask));

router.patch('/updateTask/:taskId', asyncHandler(updateTaskDetails));


export default router;