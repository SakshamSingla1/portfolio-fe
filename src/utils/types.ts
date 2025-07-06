export interface IPagination {
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    handleChangePage: (event: any, newPage: number) => void;
    handleChangeRowsPerPage: (event: any) => void;
}
