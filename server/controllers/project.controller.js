import ProjectModel from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import UserModel from "../models/user.model.js";
import { validationResult } from "express-validator";

export const createProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;

    const loggedInUser = await UserModel.findOne({ email: req.user.email });

    const userId = loggedInUser._id;

    const newProject = await projectService.createProject({
      name,
      userId,
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const loggedInUser = await UserModel.findOne({ email: req.user.email });

    const userId = loggedInUser._id;

    const allUserProjects = await projectService.getAllProjectsByUserId({
      userId,
    });

    return res.status(200).json({ projects: allUserProjects });
  } catch (e) {
    console.log(e);
    res.status(400).json({ err: e.message });
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body;
    const loggedInUser = await UserModel.findOne({ email: req.user.email });

    const project = await projectService.addUserToProject({
      projectId,
      users,
      userId: loggedInUser._id,
    });

    return res.status(200).json({ project });
  } catch (e) {
    console.log(e);
    res.status(400).json({ err: e.message });
  }
};

export const getProjectById = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await projectService.getProjectById({
      projectId,
    });
    return res.status(200).json({ project });
  } catch (e) {
    console.log(e);
    res.status(400).json({ err: e.message });
  }
};
