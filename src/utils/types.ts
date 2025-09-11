export interface IPagination {
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    handleChangePage: (event: any, newPage: number) => void;
    handleChangeRowsPerPage: (event: any) => void;
}

export interface IOption {
    value: string | number;
    label: string | number | React.ReactNode;
}
