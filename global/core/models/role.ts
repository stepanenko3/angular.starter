import { Permission } from './permission';

export interface Role {
    id: number;
    name: string;
    display_name: string;
    description?: string;

    perms: Permission[];
}
