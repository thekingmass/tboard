import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import ProjectModel from '../models/ProjectModel';
import ColumnModel from '../models/ColumnModel';
import TasksModel from '../models/TasksModel';

const PRIORITIES = ['low', 'medium', 'high'] as const;
type SeedPriority = (typeof PRIORITIES)[number];

function randomPriority(): SeedPriority {
  const idx = Math.floor(Math.random() * PRIORITIES.length);
  // idx is always within bounds, but TS can't prove it.
  return PRIORITIES[idx] ?? 'low';
}

function statusForColumnTitle(title: string) {
  switch (title) {
    case 'TO DO':
      return 'not started' as const;
    case 'In Progress':
      return 'in progress' as const;
    case 'Review':
      return 'in review' as const;
    case 'Completed':
      return 'completed' as const;
    default:
      return 'not started' as const;
  }
}

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGO_URI is not set');

  await mongoose.connect(mongoUri);

  const projects = await ProjectModel.find({}, { _id: 1 }).lean();

  let created = 0;
  let skippedMissingColumns = 0;
  let skippedColumnHasTasks = 0;

  const columnTitles = ['TO DO', 'In Progress', 'Review', 'Completed'] as const;

  for (const project of projects) {
    const projectId = new Types.ObjectId(project._id);

    // Resolve all required columns (prefer project-specific, else global defaults)
    const columnsByTitle = new Map<(typeof columnTitles)[number], any>();

    for (const title of columnTitles) {
      const col =
        (await ColumnModel.findOne({ projectId, isDefault: false, title }).lean()) ??
        (await ColumnModel.findOne({ isDefault: true, title }).lean());

      if (!col?._id) break;
      columnsByTitle.set(title, col);
    }

    if (columnsByTitle.size !== columnTitles.length) {
      skippedMissingColumns++;
      continue;
    }

    const tasksToInsert: any[] = [];

    for (const title of columnTitles) {
      const col = columnsByTitle.get(title)!;

      // NEW: If this column already has any tasks for this project, skip seeding tasks in it
      const columnHasTasks = await TasksModel.exists({ projectId, columnId: col._id });
      if (columnHasTasks) {
        skippedColumnHasTasks++;
        continue;
      }

      tasksToInsert.push(
        {
          projectId,
          columnId: col._id,
          title: `${title} - Task 1`,
          priority: randomPriority(),
          status: statusForColumnTitle(title),
          order: 0,
          tags: ['default'],
        },
        {
          projectId,
          columnId: col._id,
          title: `${title} - Task 2`,
          priority: randomPriority(),
          status: statusForColumnTitle(title),
          order: 1,
          tags: ['default'],
        }
      );
    }

    if (tasksToInsert.length > 0) {
      await TasksModel.insertMany(tasksToInsert);
      created += tasksToInsert.length;
    }
  }

  console.log(
    `[seedDefaultTasks] Done. Created=${created}, Skipped(missingColumns)=${skippedMissingColumns}, Skipped(columnsWithTasks)=${skippedColumnHasTasks}`
  );

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('[seedDefaultTasks] Failed:', err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});