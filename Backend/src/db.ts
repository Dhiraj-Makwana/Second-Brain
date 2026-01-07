import mongoose, { model, Schema } from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const mongo_URI = process.env.MONGO_URI

if(!mongo_URI) {
    throw new Error("MONGO_URI is not defined in environment variables")
}

mongoose.connect(mongo_URI)

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true }
})

export const UserModel = model("User", UserSchema)