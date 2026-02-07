import mongoose, { Schema, Types, type HydratedDocument } from 'mongoose';
import type { Project } from '../types/project';

// Mongoose document type (hydrated)
export type ProjectDocument = HydratedDocument<Project>;

const ProjectSchema = new Schema<Project>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },

        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        assignedTo: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            default: [],
            index: true,
        },
    },
    {
        timestamps: true,
        // ensures virtuals show up in JSON responses
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Backward compatibility: existing code (controllers/seed) still references openTasks/totalTasks.
// We keep them as virtuals returning 0 until Tasks aggregation is implemented.
ProjectSchema.virtual('openTasks').get(function () {
    return 0;
});
ProjectSchema.virtual('totalTasks').get(function () {
    return 0;
});

export default mongoose.model<Project>('Project', ProjectSchema);
