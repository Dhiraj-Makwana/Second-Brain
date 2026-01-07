import express from "express"
import { UserModel } from "./db"
import mongoose from "mongoose"
import z from "zod"
import bcrypt from "bcrypt"

const app = express()
app.use(express.json())

const SignUpSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(10)
    .regex(/^[A-Za-z]+$/, "Username must contain only letters"),

  password: z
    .string()
    .min(8)
    .max(20)
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

app.post("/api/v1/signup", async (req, res) => {
  //try catch, zod validation, hash password
  const result = SignUpSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error,
    });
  }

  const { username, password } = result.data;

  //hash password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    await UserModel.create({
      username: username,
      password: hashedPassword,
    });

    res.json({
      message: "User is Signed up",
    });
  } catch (error) {
    res.json({
      error: "User already exist:( Please Sign in",
    });
  }
});

app.listen(3000)