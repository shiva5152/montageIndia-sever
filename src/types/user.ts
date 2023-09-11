import { Document } from "mongoose";
export interface AdminDocument extends Document {
    name: string;
    email: string;
    password: string;
    role: 'superAdmin' | 'admin' | 'vendor';
    category: string;
    createJWT(): string;
    comparePassword(givenPassword: string): Promise<boolean>;
}