import { Document } from "mongoose";
export interface AdminDocument extends Document {
    name: string;
    email: string;
    uid: string;
    password: string;
    role: 'superAdmin' | 'admin' | 'vendor';
    category: string;
    mediaType: String;
    createJWT(): string;
    comparePassword(givenPassword: string): Promise<boolean>;
}