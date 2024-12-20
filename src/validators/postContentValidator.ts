import { z } from "zod";


const contentTypes = ["youtube", "twitter", "article", "audio"] as const;
export const postContentValidator = z.object({
    title: z.string()
        .nonempty("Title is required")
        .min(3, "Title must be at least 3 characters long")
        .max(255, "Title cannot exceed 255 characters"),
    
    type: z.enum(contentTypes),

    link: z.string()
        .url("Invalid URL format")
        .nonempty("Link is required"),

    /*
        The regex matches strings that are exactly 24 characters long and contain only hexadecimal characters (letters a-f, A-F, and digits 0-9).
        This is the standard format for MongoDB's ObjectId, which is a 24-character hexadecimal string.
    */
    tags: z.array(z.string())                                                            
        .optional()
});