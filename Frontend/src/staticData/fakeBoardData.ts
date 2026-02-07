import type { ProjectBoardData } from "../types";

export const fakeBoardData: ProjectBoardData = {
  projectName: "ToDo React Frontend ",
  projectDescription: "Personal portfolio built with the MERN stack",
  columns: [
     { id: "col-1", title: "To Do", order: 0 },
    { id: "col-2", title: "In Progress", order: 1 }, 
    { id: "col-4", title: "Review", order: 2 },
    { id: "col-3", title: "Completed", order: 3 },
   
  ],
  tasks: [
    {
      id: "task-1",
      columnId: "col-1",
      title: "Design homepage layout",
      priority: "high",
      tags: ["design", "frontend", "UI"],
      order: 0,
    },
    {
      id: "task-1",
      columnId: "col-3",
      title: "Design homepage layout",
      priority: "high",
      tags: ["design", "frontend", "UI"],
      order: 0,
    },
    {
      id: "task-2",
      columnId: "col-1",
      title: "Plan MongoDB schema",
      priority: "medium",
      tags: ["backend", "database", "planning"],
      order: 1,
    },
    {
      id: "task-3",
      columnId: "col-2",
      title: "Build React navbar",
      priority: "medium",
      tags: ["frontend", "UI", "navigation"],
      order: 2,
    },
    {
      id: "task-4",
      columnId: "col-2",
      title: "Implement auth flow",
      priority: "high",
      tags: ["backend", "auth"],
      order: 3,
    },
    {
      id: "task-5",
      columnId: "col-3",
      title: "Set up project structure",
      priority: "low",
      tags: ["chore"],
      order: 4,
    },
  ],
};