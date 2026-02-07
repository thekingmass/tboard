import mongoose, { Schema, type HydratedDocument } from 'mongoose';
import type { column as Column } from '../types/column';

export type ColumnDocument = HydratedDocument<Column>;

const ColumnSchema = new Schema<Column>(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    isDefault: { type: Boolean, required: true, default: false, index: true },
    // When isDefault=true, projectId is intentionally omitted (global template columns)
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
  },
  { timestamps: true }
);

// Within a project, a given order should be unique.
// For default columns (projectId missing), we still want order unique among defaults.
ColumnSchema.index(
  { isDefault: 1, projectId: 1, order: 1 },
  {
    unique: true,
    // Make uniqueness apply separately for:
    // - default docs (projectId doesn't exist)
    // - per-project docs (projectId exists)
    partialFilterExpression: {
      $or: [{ isDefault: true, projectId: { $exists: false } }, { isDefault: false, projectId: { $exists: true } }],
    },
  }
);

export default mongoose.model<Column>('Column', ColumnSchema);
