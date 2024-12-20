import { Document, Types } from "mongoose";

export interface contentType extends Document {
    title: string;
    type: "youtube" | "twitter" | "article" | "audio";
    link: string;
    tags?: Types.ObjectId[];
    userId: Types.ObjectId;
}


export interface postContentData {
    title: string, 
    type: string, 
    link: string, 
    tags?: string[]
}

