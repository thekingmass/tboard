import 'dotenv/config';
import mongoose from 'mongoose';
import ColumnModel from '../models/ColumnModel';

const DEFAULT_COLUMN_TITLES = ['TO DO', 'In Progress', 'Review', 'Completed'] as const;

async function seedGlobalDefaultColumnsOnce() {
  // We store ONE set of default columns (isDefault=true) without any projectId.
  const existing = await ColumnModel.countDocuments({ isDefault: true });
  if (existing > 0) {
    console.log(`Default columns already exist (${existing}). Skipping.`);
    return;
  }

  await ColumnModel.insertMany(
    DEFAULT_COLUMN_TITLES.map((title, index) => ({
      title,
      order: index,
      isDefault: true,
    }))
  );

  console.log(`Inserted ${DEFAULT_COLUMN_TITLES.length} global default columns.`);
}

async function main() {
  const MONGO_URI = process.env.MONGO_URI as string;
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in .env');
  }

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  try {
    // (Optional) Keep this import as a sanity check that project model loads,
    // but we don't need projects to seed global default columns.
    await seedGlobalDefaultColumnsOnce();
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('❌ Failed to seed default columns', err);
  process.exit(1);
});
