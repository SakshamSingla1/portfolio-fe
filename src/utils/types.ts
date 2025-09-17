export interface IOption {
    value: string | number;
    label: string | number | React.ReactNode;
}

export interface IPagination {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
};