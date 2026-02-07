import { Types } from 'mongoose';

export interface column {
    id: string;
    title: string;
    order: number;
    isDefault: boolean;
    projectId?: Types.ObjectId;

} 


