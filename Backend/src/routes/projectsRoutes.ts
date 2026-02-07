import { Router } from 'express';

import {
    getAllProjects,
    createNewProject, 
    deleteProject, 
    updateProject,
    getProjectById
} from '../controller/projectsController';

import { getColumnsForProject } from '../controller/columnsController';

import { getTasksForProject, getNumberOfOpenTasks, getNumberOfCompletedTasks } from '../controller/tasksController';

import { asyncHandler } from '../middleware/asyncHandler';


const router = Router();

// When someone does GET /api/projects, call getAllProjects
router.get('/', getAllProjects);

router.get('/:projectId', asyncHandler(getProjectById as any));

router.post('/createNewProject', createNewProject);

router.delete('/deleteProject/:id', deleteProject);

router.patch('/updateProject/:id', updateProject);

router.get('/columns/:projectId', asyncHandler(getColumnsForProject as any));

router.get('/tasks/:projectId', asyncHandler(getTasksForProject as any));

router.get('/tasks/getOpenTasks/:projectId', asyncHandler(getNumberOfOpenTasks as any));

router.get('/tasks/getCompletedTasks/:projectId', asyncHandler(getNumberOfCompletedTasks as any));

export default router;