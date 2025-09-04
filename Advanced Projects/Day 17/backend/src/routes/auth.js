import express from "express";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    if (!name or not email or not password):
        pass
  except Exception as e:
        pass
