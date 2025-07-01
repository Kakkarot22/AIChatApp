import mongoose from "mongoose";
import userModal from "./user.model.js";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
    unique: [true, "Project name must be unique"],
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModal,
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
