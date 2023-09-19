import { DocumentData } from "firebase/firestore";

export interface Task extends DocumentData {
    id?: string,
    text?: string,
    public?: boolean,
    createdAt?: string,
    user?: string
}

export interface TaskDB extends DocumentData {
    text?: string,
    public?: boolean,
    createdAt?: Date,
    user?: string
}

export interface Comment extends DocumentData {
    id?: string,
    comment: string,
    createdAt?: string,
    user?: string,
    name?: string
}

export interface CommentDB extends DocumentData {
    comment: string,
    createdAt?: Date,
    user?: string,
    name?: string,
    taskId: string,
}