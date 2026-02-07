import { Schema, model, type HydratedDocument } from 'mongoose';
import type { Task } from '../types/task';
import { PRIORITIES, STATUS } from '../types/task';

export type TaskDocument = HydratedDocument<Task>;

const TaskSchema = new Schema<Task>(
    {
        columnId: { type: Schema.Types.ObjectId, required: true, index: true },
        projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },

        title: { type: String, required: true, trim: true },
        priority: { type: String, required: true, enum: PRIORITIES },
        status: { type: String, required: true, enum: STATUS },
        dueDate: { type: Date },
        tags: { type: [String], default: [] },
        order: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

export default model<Task>('Task', TaskSchema);

