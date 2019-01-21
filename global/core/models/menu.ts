export interface Menu {
    id: number;
    area: string;
    name: string;
    items?: MenuItem[];
}

export interface MenuItem {
    id: number;
    parent_id: number;

    link: string;
    name: string;
    description?: string;

    children?: MenuItem[];
}
