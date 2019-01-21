export * from './user';
export * from './role';
export * from './permission';

import { User } from './user';
import { Role } from './role';
import { Permission } from './permission';

export interface Token {
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: User;
    roles: Role[];
    perms: Permission[];
    favorites: number[];
    providers: any[];
}
