import { Request, Response } from 'express';
import ProjectModel from '../models/ProjectModel';
import TasksModel from '../models/TasksModel';
import { HttpError, requireAccessibleProject, requireAuthUserId, requireValidObjectId } from '../utils/validation';

// GET /api/projects
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.sub;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const projects = await ProjectModel.find({
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST api/projects/:projectId
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const userId = requireAuthUserId(req.auth?.sub);
    const projectId = req.params.projectId;
    requireValidObjectId(projectId, 'projectId');
    const project = await requireAccessibleProject({ projectId, userId });

    res.status(200).json(project);
  } catch (err: any) {
    console.error('Error fetching project by ID', err);
    const status = err instanceof HttpError ? err.statusCode : 500;
    res.status(status).json({ message: err?.message ?? 'Internal server error' });
  }
};

//POST /api/projects/createNewProject
export const createNewProject = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.auth?.sub;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if(description.length > 500) {
      return res.status(400).json({ message: "Description exceeds maximum length of 500 characters" });
    }

    const newProject = new ProjectModel({
      title,
      description,
      createdBy: userId,
      assignedTo: []
    });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  }
  catch (err) {
    console.error("Error creating new project", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /api/projects/deleteProject
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const deletedProject = await ProjectModel.findByIdAndDelete(projectId);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project Deleted Successfully", deletedProject: deletedProject });
  } catch (err) {
    console.error("Error Deleting the project", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



//PUT api/projects/updateProject
export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const { title, description } = req.body;

    if(description.length > 500) {
      return res.status(400).json({ message: "Description exceeds maximum length of 500 characters" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    if (!title || !description) {
      return res.status(400).json({ message: "Title and Description are required" });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(projectId, { title, description }, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.status(200).json({ updatedProject: updatedProject });

  } catch (err) {
    res.json({ err });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTasksForProject = async (req: Request, res: Response) => {
  try {

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const createTaskForProject = async (req: Request, res: Response) => {
  try { 

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}