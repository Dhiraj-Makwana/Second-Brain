"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
app.listen(3000);
//# sourceMappingURL=index.js.map