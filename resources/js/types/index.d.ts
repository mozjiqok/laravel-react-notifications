import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface NotificationRecord {
    id: number;
    title: string;
    text: string;
    view_counter: number;
    category_id: number;
    category: {
        name: string;
        color: string;
    };
}

export interface NotificationPreference {
    id: number;
    category_id: number;
    is_hidden: boolean;
}

export interface NotificationCategory {
    id?: number;
    name: string;
    color: string;
    description?: string;
    is_active: boolean;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    unreadNotifications: NotificationRecord[];
    ziggy: Config & { location: string };
};
