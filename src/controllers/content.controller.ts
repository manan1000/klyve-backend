import { Request, Response } from "express";
import { postContentValidator } from "../validators/postContentValidator";
import { contentType, postContentData } from "../types/contentTypes";
import { Tag } from "../models/Tag";
import { Content } from "../models/Content";
import { Types } from "mongoose";

export const postContent = async (req: Request, res: Response) => {
    const { title, type, link, tags }: postContentData = req.body;

    //@ts-ignore
    const userId = req.userId;
    try {

        const validatedData = postContentValidator.parse({ title, type, link, tags });

        const tagsIds = [];
        if (validatedData.tags) {
            for (const tagName of validatedData.tags) {
                let tag = await Tag.findOne({ title: tagName });
                if (!tag) {
                    tag = new Tag({ title: tagName });
                    await tag.save();
                }
                tagsIds.push(tag._id);
            }

        }

        const content = new Content({
            title: validatedData.title,
            type: validatedData.type,
            link: validatedData.link,
            tags: tagsIds,
            userId: new Types.ObjectId(userId)
        });

        await content.save();
        res.status(201).json({ message: "Content created successfully" });
        return;

    } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            // Handle Zod validation errors
            //@ts-ignore
            res.status(400).json({ message: "Validation error", error: error.issues[0].message});
            return;
        }

        console.error("Error adding content:", error);
        res.status(500).json({ message: "Server error", error});
        return;
    }

}

export const getContent = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const content = await Content.find({userId: req.userId})
            .populate("tags", "title-_id")
            .lean();

        const transformedContent = content.map(item => ({
            ...item,
            tags: item.tags.map((tag: any) => tag.title)
        }));
        
        res.status(200).json(transformedContent);
        return;
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
        return;
    }
}