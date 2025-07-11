import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisclient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser(req.body);
    const token = await user.generateToken();
    delete user._doc.password;
    res.status(200).json({ user, token });
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
};

export const loginUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).send({
        message: "Invalid Credentials",
      });
    }
    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      return res.status(400).send({
        message: "Invalid  password",
      });
    }
    delete user._doc.password;

    const token = await user.generateToken();
    res.status(200).json({ user, token });
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
};

export const profileController = async (req, res) => {};

export const logoutController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    redisclient.set(token, "logout", "EX", 60 * 60 * 24);

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email });

    const allUsers = await userService.getAllUsers({
      userId: loggedInUser._id,
    });
    res.status(200).json({ users: allUsers });
  } catch (e) {
    console.log("Users cannot be fetched", e.message);
  }
};
