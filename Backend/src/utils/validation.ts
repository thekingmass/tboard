import { Types } from 'mongoose';
import ProjectModel from '../models/ProjectModel';

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function requireAuthUserId(userId: string | undefined) {
  if (!userId) {
    throw new HttpError(401, 'Not authenticated');
  }
  return userId;
}

export function requireValidObjectId(id: string | undefined, name: string) {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new HttpError(400, `Invalid ${name}`);
  }
  return new Types.ObjectId(id);
}

export async function requireAccessibleProject(params: { projectId: string | undefined; userId: string}) {
  const { projectId, userId } = params;

  if (!projectId) {
    throw new HttpError(400, 'Invalid projectId');
  }

  // We validate the ObjectId format, but still use the original string in the query.
  // (Mongoose will cast it; this avoids accidental use of an ObjectId created from a different string.)
  requireValidObjectId(projectId, 'projectId');

  const project = await ProjectModel.findOne({
    _id: projectId,
    $or: [{ createdBy: userId }, { assignedTo: userId }],
  }).lean();

  if (!project) {
    throw new HttpError(404, 'Project not found or access denied for the user');
  }

  return project;
}
