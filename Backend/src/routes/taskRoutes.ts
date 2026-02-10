import { Router } from 'express';
import { updateTaskOnDragEnd, 
    createTaskForProject, 
    deleteTask, 
    updateTaskDetails,
    addTagToTask,
    deleteTagFromTask,
} 
    from '../controller/tasksController';
import { asyncHandler } from '../middleware/asyncHandler';


const router = Router();

router.patch('/updateTaskOnDragEnd', asyncHandler(updateTaskOnDragEnd));

router.post('/createTask', asyncHandler(createTaskForProject));

router.delete('/deleteTask/:taskId', asyncHandler(deleteTask));

router.patch('/updateTask/:taskId', asyncHandler(updateTaskDetails));

router.post('/addTagToTask/:taskId', asyncHandler(addTagToTask));

router.delete('/deleteTagFromTask/:taskId', asyncHandler(deleteTagFromTask));


export default router;