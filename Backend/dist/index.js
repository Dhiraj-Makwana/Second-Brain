"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const Middleware_1 = require("./Middleware");
const utils_1 = require("./utils");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_PASSWORD;
if (!JWT_SECRET) {
    throw new Error("JWT SECRET is not defined in environment variables");
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
/*----------SignUp_&_SignIn----------*/
const SignUpSchema = zod_1.default.object({
    username: zod_1.default
        .string()
        .min(3)
        .max(10)
        .regex(/^[A-Za-z]+$/, "Username must contain only letters"),
    password: zod_1.default
        .string()
        .min(8)
        .max(20)
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
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
    const hashedPassword = await bcrypt_1.default.hash(password, 8);
    try {
        await db_1.UserModel.create({
            username: username,
            password: hashedPassword,
        });
        res.json({
            message: "User is Signed up",
        });
    }
    catch (error) {
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
    const existingUser = await db_1.UserModel.findOne({ username });
    if (!existingUser) {
        return res.status(403).json({
            message: "Incorrect Credentials",
        });
    }
    const isPasswordCorrect = await bcrypt_1.default.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
        res.status(403).json({
            message: "Incorrect Credentials",
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, JWT_SECRET);
    return res.json({ token });
});
app.post("/api/v1/content", Middleware_1.userMiddleware, async (req, res) => {
    const link = req.body.link;
    const title = req.body.title;
    const type = req.body.type;
    await db_1.ContentModel.create({
        link,
        title,
        type,
        userId: new mongoose_1.default.Types.ObjectId(req.userId),
        tags: [],
    });
    return res.json({
        message: "Content is added",
    });
});
app.get("/api/v1/content", Middleware_1.userMiddleware, async (req, res) => {
    const content = await db_1.ContentModel.find({
        userId: new mongoose_1.default.Types.ObjectId(req.userId),
    }).populate("userId", "username");
    res.json({
        content,
    });
});
app.delete("/api/v1/content", Middleware_1.userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    try {
        await db_1.ContentModel.deleteOne({
            _id: new mongoose_1.default.Types.ObjectId(contentId),
            userId: new mongoose_1.default.Types.ObjectId(req.userId),
        });
        res.json({
            message: "Content Deleted Successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            error: "Failed to delete content",
        });
    }
});
app.post("/api/v1/brain/share", Middleware_1.userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existingLink = await db_1.LinkModel.findOne({
            userId: new mongoose_1.default.Types.ObjectId(req.userId),
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash,
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        await db_1.LinkModel.create({
            userId: new mongoose_1.default.Types.ObjectId(req.userId),
            hash: hash,
        });
        res.json({
            message: "/share/" + hash,
        });
    }
    else {
        await db_1.LinkModel.deleteOne({
            userId: new mongoose_1.default.Types.ObjectId(req.userId),
        });
        res.json({
            message: "Removed link",
        });
    }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await db_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    // userId
    const content = await db_1.ContentModel.find({
        userId: link.userId
    });
    const user = await db_1.UserModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
});
app.listen(3000);
//# sourceMappingURL=index.js.map