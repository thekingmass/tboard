// src/seedProjects.ts
import ProjectModel from '../models/ProjectModel'; 

export async function seedProjectsIfEmpty() {
  const count = await ProjectModel.countDocuments();

  if (count > 0) {
    console.log(`Projects collection already has ${count} documents. Skipping seed.`);
    return;
  }

  console.log('Seeding initial projects into MongoDB...');

  await ProjectModel.insertMany([
    {
      title: 'TeamHub Board',
      description: 'Main project management board for TeamHub app.',
      openTasks: 5,
      totalTasks: 20,
    },
    {
      title: 'Portfolio Site',
      description: 'MERN portfolio website with projects and blogs.',
      openTasks: 2,
      totalTasks: 8,
    },
    {
      title: 'Learning TypeScript',
      description: 'Track tasks for advanced TypeScript learning.',
      openTasks: 7,
      totalTasks: 15,
    },
    {
      title: 'Open Source Contributions',
      description: 'Manage contributions to open source projects.',
      openTasks: 3,
      totalTasks: 10,
    },
    {
      title: 'Fitness Tracker App',
      description: 'Build a full-stack fitness tracking application.',
      openTasks: 4,
      totalTasks: 12,
    }
  ]);

  console.log('Seeding completed.');
}