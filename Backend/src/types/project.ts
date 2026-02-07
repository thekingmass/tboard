import { Types } from 'mongoose';

/**
 * Shared project type used across backend.
 *
 * Note: We intentionally don't include derived task counters (openTasks/totalTasks)
 * because they should be computed from the Tasks collection.
 */
export interface Project {
  id: string;
  title: string;
  description: string;

  // Access control
  createdBy: Types.ObjectId;
  assignedTo: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}
