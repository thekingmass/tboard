export type Priority = 'low' | 'medium' | 'high';

export type projectFilterOptions = 'All' | 'Assigned to me' | 'Created by me' | 'High Priority' | 'Medium Priority' | 'Low Priority';

export interface Project{
  id: string;
  title: string;
  description: string;
  createdBy: string;
  assignedTo?: string[];
  updatedAt?: string;
  createdAt?: string;
  openTasks?: number;
  totalTasks?: number;
}

export const DESCRIPTION_MAX_LEN = 500;
export const TITLE_MAX_LEN = 100;

export interface ApiProject{
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  assignedTo?: string[];
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

// Backend DTO shape (Mongo-style). Keep this separate from UI `Column`.
export interface ApiColumn {
  _id: string;
  title: string;
  order: number;
  isDefault: boolean;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  columnId: string; // which column this task belongs to
  title: string;
  priority: Priority;
  tags: string[];
  order: number;
}

export interface ApiTask {
  _id: string;
  columnId: string; // which column this task belongs to
  projectId: string; // which project this task belongs to
  title: string;
  priority: Priority;
  tags: string[];
  order: number;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectBoardData {
  projectName: string;
  projectDescription: string;
  columns: Column[];
  tasks: Task[];
}


export interface ourServicesCardData {
  title: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mapper functions: convert API (backend) shapes → UI (frontend) shapes
// ─────────────────────────────────────────────────────────────────────────────

/** Convert backend ApiTask to frontend Task */
export function mapApiTaskToTask(api: ApiTask): Task {
  return {
    id: api._id,
    columnId: api.columnId,
    title: api.title,
    priority: api.priority,
    tags: api.tags,
    order: api.order,
  };
}

/** Convert backend ApiColumn to frontend Column */
export function mapApiColumnToColumn(api: ApiColumn): Column {
  return {
    id: api._id,
    title: api.title,
    order: api.order,
  };
}

/** Convert backend ApiProject to frontend Project */
export function mapApiProjectToProject(api: ApiProject): Project {
  return {
    id: api._id,
    title: api.title,
    description: api.description,
    createdBy: api.createdBy,
    assignedTo: api.assignedTo,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Request payload types (what we send TO the API)
// ─────────────────────────────────────────────────────────────────────────────

/** Payload for creating a new task (excludes server-generated fields) */
export interface CreateTaskPayload {
  title: string;
  priority: Priority;
  tags: string; // comma-separated string from form; backend may split it
  status: string;
  order: number;
  projectId: string;
  columnId: string;
}
