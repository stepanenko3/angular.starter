export interface Pagination {
    current_page: number;
    data: any[];
    from: number;
    last_page: number;
    per_page: number;
    path: string;
    to: number;
    total: number;
}
