export interface Meta {
    total: number;
    page: number;
    limit: number;
    sortBy: string;
    sortDirection: 'desc';
    query: string | undefined;
}
