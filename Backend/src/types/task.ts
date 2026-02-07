import { Types } from 'mongoose';

export const PRIORITIES = ['low', 'medium', 'high'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const STATUS = ['not started', 'in progress', 'in review', 'completed', 'blocked'] as const;
export type Status = (typeof STATUS)[number];

/**
 * Shared task type used across backend.
 */
export interface Task {
    id: string;
    columnId: Types.ObjectId; // which column this task belongs to
    title: string;
    priority: Priority;
    dueDate?: Date;
    tags?: string[];
    order: number;
    projectId: Types.ObjectId; // reference to the project
    createdAt: Date;
    updatedAt: Date;
    status: Status;
}


