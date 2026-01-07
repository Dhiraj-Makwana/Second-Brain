import express from "express"
import { ContentModel, LinkModel, UserModel } from "./db"
import mongoose from "mongoose"
import z from "zod"
import bcrypt from "bcrypt"
import cors from "cors"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { userMiddleware } from "./Middleware"
import { random } from "./utils"
dotenv.config()

const JWT_SECRET = process.env.JWT_PASSWORD;

if (!JWT_SECRET) {
  throw new Error("JWT SECRET is not defined in environment variables");
}

const app = express()
app.use(express.json())
app.use(cors())

/*----------SignUp_&_SignIn----------*/
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

app.post("/api/v1/signin", async (req, res) => {
  const result = SignUpSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error,
    });
  }

  const { username, password } = result.data;

  const existingUser = await UserModel.findOne({ username });

  if (!existingUser) {
    return res.status(403).json({
      message: "Incorrect Credentials",
    });
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    res.status(403).json({
      message: "Incorrect Credentials",
    });
  }

  const token = jwt.sign({ id: existingUser._id }, JWT_SECRET);

  return res.json({ token });
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const title = req.body.title;
  const type = req.body.type;

  await ContentModel.create({
    link,
    title,
    type,
    userId: new mongoose.Types.ObjectId(req.userId),
    tags: [],
  });
  return res.json({
    message: "Content is added",
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const content = await ContentModel.find({
    userId: new mongoose.Types.ObjectId(req.userId),
  }).populate("userId", "username");
  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  try {
    await ContentModel.deleteOne({
      _id: new mongoose.Types.ObjectId(contentId as string),
      userId: new mongoose.Types.ObjectId(req.userId),
    });

    res.json({
      message: "Content Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to delete content",
    });
  }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;
  if (share) {
    const existingLink = await LinkModel.findOne({
      userId: new mongoose.Types.ObjectId(req.userId),
    });

    if (existingLink) {
      res.json({
        hash: existingLink.hash,
      });
      return;
    }
    const hash = random(10);
    await LinkModel.create({
      userId: new mongoose.Types.ObjectId(req.userId),
      hash: hash,
    });
    res.json({
      message: "/share/" + hash,
    });
  } else {
    await LinkModel.deleteOne({
      userId: new mongoose.Types.ObjectId(req.userId),
    });

    res.json({
      message: "Removed link",
    });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    // userId
    const content = await ContentModel.find({
        userId: link.userId
    })

    const user = await UserModel.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })
});

app.listen(3000)