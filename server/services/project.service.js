import mongoose from "mongoose";
import projectModel from "../models/project.model.js";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }
  if (!userId) {
    throw new Error("userId is required");
  }

  let project;
  try {
    project = await projectModel.create({
      name,
      users: [userId],
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Project name already exists");
    }
    throw error;
  }

  return project;
};

export const getAllProjectsByUserId = async ({ userId }) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  const allUserProjects = await projectModel.find({ users: userId });

  return allUserProjects;
};
export const addUserToProject = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("Project Id is required");
  }

  if (!mongoose.isValidObjectId(projectId)) {
    throw new Error("Invalid project Id");
  }

  if (!users || !Array.isArray(users) || users.length === 0) {
    throw new Error("Users must be a non-empty array of non-empty strings");
  }

  if (!userId) {
    throw new Error("userId is required");
  }
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user Id");
  }

  const project = await projectModel.findOne({ _id: projectId, users: userId });

  if (!project) {
    throw new Error("Project not found or user not part of the project");
  }
  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { users: { $each: users } } },
    { new: true }
  );

  return updatedProject;
};

export const getProjectById = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("Project Id is required");
  }

  if (!mongoose.isValidObjectId(projectId)) {
    throw new Error("Invalid project Id");
  }

  const project = await projectModel
    .findOne({ _id: projectId })
    .populate("users");

  return project;
};
