import mongoose, { Types } from "mongoose";

export const contentTypes = ["image", "video", "article", "audio"];

const contentSchema = new mongoose.Schema({
    title: { type: String },
    type: {type: String, enum: contentTypes, required: true},
    link: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    userId: { type: Types.ObjectId, ref: "User" },
});

export const Content = mongoose.model("Content", contentSchema);