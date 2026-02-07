import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import ProjectModel from '../models/ProjectModel';
import ColumnModel from '../models/ColumnModel';
import TasksModel from '../models/TasksModel';
import { HttpError, requireAccessibleProject, requireAuthUserId, requireValidObjectId } from '../utils/validation';

// GET /api/projects/tasks/:projectId
// Returns: all tasks for the specified project if the user has access.

export const getTasksForProject = async (req: Request, res: Response) => {
    try {
        const userId = requireAuthUserId(req.auth?.sub);
        const { projectId } = req.params;
        requireValidObjectId(projectId, 'projectId');
        await requireAccessibleProject({ projectId, userId });

        console.log("Fetching tasks for projectId:", projectId);

        const tasks = await TasksModel.find({
            projectId: new Types.ObjectId(projectId),
        }).sort({ order: 1, createdAt: 1 }).lean();

        console.log(`Found ${tasks.length} tasks for projectId: ${projectId}`);

        res.status(200).json(tasks);
    } catch (err: any) {
        const status = err instanceof HttpError ? err.statusCode : 500;
        res.status(status).json({ message: err?.message ?? 'Internal server error' });
    }
};

export const getNumberOfOpenTasks = async (req: Request, res: Response) => {
    try {
        const userId = requireAuthUserId(req.auth?.sub);
        const { projectId } = req.params;
        requireValidObjectId(projectId, 'projectId');
        await requireAccessibleProject({ projectId, userId });

        const openTasks = await TasksModel.countDocuments({
            projectId: new Types.ObjectId(projectId),
            status: { $not: { $in: ['completed', 'blocked'] } },
        });

        res.status(200).json( openTasks );

    } catch (err: any) {
        const status = err instanceof HttpError ? err.statusCode : 500;
        res.status(status).json({ message: err?.message ?? 'Internal server error' });
    }
};

export const getNumberOfCompletedTasks = async (req: Request, res: Response) => {
    try {
        const userId = requireAuthUserId(req.auth?.sub);
        const { projectId } = req.params;
        requireValidObjectId(projectId, 'projectId');
        await requireAccessibleProject({ projectId, userId });

        const completedTasks = await TasksModel.countDocuments({
            projectId: new Types.ObjectId(projectId),
            status: 'completed',
        });

        res.status(200).json( completedTasks );
    } catch (err: any) {
        const status = err instanceof HttpError ? err.statusCode : 500;
        res.status(status).json({ message: err?.message ?? 'Internal server error' });
    }
};

export const updateTaskOnDragEnd = async (req: Request, res: Response) => {

    //initializing a session of mongoose to make this operation transactional
    const session = await mongoose.startSession();

    try {

        const userId = req.auth?.sub;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const dragResult = req.body.result;

        if (!dragResult?.destination) {
            // dropped outside any droppable
            return res.status(200).json({ message: 'No destination. No changes applied.' });
        }


        console.log("Drag Result:", dragResult);

        // The taskId, sourceColumnId are comming as string by the dnd library. its the default behavior of the library.It takes the values from the DOM
        const taskId = dragResult.draggableId as string;
        const sourceColumnId = dragResult.source.droppableId as string;
        const sourceIndex = dragResult.source.index as number;
        const destinationColumnId = dragResult.destination.droppableId as string;
        const destinationIndex = dragResult.destination.index as number;

        if (!taskId || !destinationColumnId || !sourceColumnId) {
            return res.status(400).json({ message: 'taskId, sourceColumnId and destinationColumnId are required' });
        }

        if (
            !Types.ObjectId.isValid(taskId) ||
            !Types.ObjectId.isValid(destinationColumnId) ||
            !Types.ObjectId.isValid(sourceColumnId)
        ) {
            return res.status(400).json({ message: 'Invalid taskId, sourceColumnId or destinationColumnId' });
        }

        //initiallizing transaction
        await session.withTransaction(async () => {

            console.log("Transaction started for updating task on drag end");

            const task = await TasksModel.findById(taskId).session(session);
            if (!task) {
                throw Object.assign(new Error('Task not found'), { statusCode: 404 });
            }

            const projectId = task.projectId;
            // Ensure user has access to the project that owns the task
            const project = await ProjectModel.findOne({
                _id: projectId,
                $or: [{ createdBy: userId }, { assignedTo: userId }],
            }).session(session).lean();

            if (!project) {
                throw Object.assign(new Error('Project not found or access denied'), { statusCode: 404 });
            }

            //Typing ObjectId conversion from string to ObjectId
            // The drag result contains the objectIds as string
            const srcCol = new Types.ObjectId(sourceColumnId);
            const destCol = new Types.ObjectId(destinationColumnId);

            // Sanity: ensure drag source matches the task's current column
            // (optional but prevents corrupted order if frontend is stale)
            if (!task.columnId.equals(srcCol)) {
                // If frontend is stale, treat source as current value
                // or reject the request. Here we reject:
                throw Object.assign(new Error('Task column mismatch (stale client state)'), { statusCode: 409 });
            }

            if (srcCol.equals(destCol)) {

                // Reorder within same column
                if (sourceIndex === destinationIndex) return;


                if (sourceIndex < destinationIndex) {
                    // moving Downward in the list
                    await TasksModel.updateMany(
                        {
                            projectId,
                            columnId: srcCol,
                            order: { $gt: sourceIndex, $lte: destinationIndex },
                        },
                        { $inc: { order: -1 } },
                        { session }
                    );
                    task.order = destinationIndex;
                    await task.save({ session });
                }
                else {
                    // moving Upward in the list
                    await TasksModel.updateMany(
                        {
                            projectId,
                            columnId: srcCol,
                            order: { $gte: destinationIndex, $lt: sourceIndex },
                        },
                        { $inc: { order: 1 } },
                        { session }
                    );

                    task.order = destinationIndex;
                    await task.save({ session });
                }

            } else {

                // Moving to a different column

                // 1) close gap in source column
                await TasksModel.updateMany(
                    {
                        projectId, columnId: srcCol,
                        order: { $gt: sourceIndex }
                    },
                    { $inc: { order: -1 } },
                    { session }
                );

                // 2) make room in destination column
                await TasksModel.updateMany(
                    { projectId, columnId: destCol, order: { $gte: destinationIndex } },
                    { $inc: { order: 1 } },
                    { session }
                );

                // 3) move task
                task.columnId = destCol;
                task.order = destinationIndex;
                await task.save({ session });

            }

        });
        return res.status(200).json({ message: 'Task updated successfully' });
    }
    catch (err: any) {
        const status = err?.statusCode ?? 500;
        return res.status(status).json({ message: err?.message ?? 'Internal server error' });
    } finally {
        session.endSession();
    }
};


export const createTaskForProject = async (req: Request, res: Response) => {
    try {
        const userId = req.auth?.sub;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });
        console.log(req.auth);

        const { title, priority, tags, projectId, columnId, status, order } = req.body;

        requireValidObjectId(projectId, 'projectId');
        await requireAccessibleProject({ projectId, userId });



        const rawTags = String(tags ?? '')
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        // Reject the request if any tag contains whitespace inside (spaces, tabs, etc.)
        const hasWhitespaceInside = rawTags.some((t) => /\s/.test(t));
        if (hasWhitespaceInside) {
            return res.status(400).json({
                message: 'Tags must not contain spaces. Use single words like "frontend" or use "-" like "front-end".',
            });
        }

        // Rejects the request if any tag contains letters other than a-z A-Z 0-9 and _,- characters
        const invalidChars = rawTags.some((t) => !/^[A-Za-z0-9_-]+$/.test(t));
        if (invalidChars) {
            return res.status(400).json({
                message: 'Tags may only contain letters, numbers, "_" or "-".',
            });
        }

        const taskTags = rawTags;

        console.log(typeof taskTags, taskTags);

        const taskCreationResult = await TasksModel.create({
            columnId: new Types.ObjectId(columnId),
            projectId: new Types.ObjectId(projectId),
            priority: priority,
            title,
            tags: taskTags,
            status,
            order
        });

        res.status(200).json({ message: "Task created successfully", task: taskCreationResult });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

}

