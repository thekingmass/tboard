import { Request, Response } from 'express';
import { Types } from 'mongoose';
import ProjectModel from '../models/ProjectModel';
import ColumnModel from '../models/ColumnModel';
import { HttpError, requireAccessibleProject, requireAuthUserId, requireValidObjectId } from '../utils/validation';

// GET /api/projects/:projectId/columns
// Returns: global default columns + columns created for this project.
export const getColumnsForProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = requireAuthUserId(req.auth?.sub);
    requireValidObjectId(projectId, 'projectId');
    await requireAccessibleProject({ projectId, userId });

    const columns = await ColumnModel.find({
      $or: [
        { isDefault: true, projectId: { $exists: false } },
        { isDefault: false, projectId: new Types.ObjectId(projectId) },
      ],
    }).sort({ order: 1, createdAt: 1 });

    return res.status(200).json(columns);
  } catch (err: any) {
    console.error('Error fetching columns', err);
    const status = err instanceof HttpError ? err.statusCode : 500;
    return res.status(status).json({ message: err?.message ?? 'Internal server error' });
  }
};
