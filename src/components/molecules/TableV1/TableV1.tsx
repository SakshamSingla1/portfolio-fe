import React, { useState } from "react";
import TablePagination from '@mui/material/TablePagination';
import DateTimeCell from "../../atoms/TableUtils/DateTimeCell";
import CurrencyCell from "../../atoms/TableUtils/CurrencyCell";
import NumberCell from "../../atoms/TableUtils/NumberCell";
import StringCell from "../../atoms/TableUtils/StringCell";
import { createUseStyles } from "react-jss";
import DateCell from "../../atoms/TableUtils/DateCell";
import { IconButton, Input } from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
export interface Pagination {
    limit: number;
    isVisible: boolean;
    currentPage: number;
    total: number;
    handleChangePage?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => void;
    handleChangeRowsPerPage?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export type ColumnType = "number" | "string" | "date" | "datetime" | "custom" | "currency";

export interface TableColumn {
    label: string;
    key: string;
    isSortable?: boolean;
    isFilterable?: boolean;
    component?: (props: any) => React.ReactNode
    type: ColumnType;
    props: { [key: string]: any };
}

export interface TableSchema {
    id: string;
    title?: string;
    pagination: Pagination;
    sort?: {
        sortBy: "asc" | "desc";
        sortOn: string;
    }
    filter?: {
        [key: string]: any;
    }
    columns: TableColumn[];
}
interface TableProps {
    schema: TableSchema;
    records: any[][];
}

const useStyles = createUseStyles((theme: any) => ({
    mainTableContainer: {
        border: `1px solid #CCC`,
        color: theme.palette.background.primary.primary700,
        overflowX: "auto", // Enable horizontal scrolling if content exceeds
    },
    cellWrap: {
        whiteSpace: "nowrap",
        padding: "0px 8px"
    },
    tableWrapper: {
        overflowX: "auto",
        width: "100%",
    },
    header: {
        backgroundColor: "#F2F2F2",
        whiteSpace: "nowrap"
    },
    title: {
        color: theme.palette.background.primary.primary700,
    },
    tableBody: {
        color: theme.palette.background.primary.primary700,
    },
    tableRow: {
        '&:nth-child(odd)': {
            backgroundColor: theme.palette.background.primary.primary50,
        },
        '&:nth-child(even)': {
            backgroundColor: theme.palette.background.primary.primary50,
        },
        '&:first-child': {
            borderBottom: 'none'
        },
        '&:last-child': {
            borderBottom: 'none'
        },
        borderBottom: `1px solid  #CCC`,
        borderTop: `1px solid #CCC`
    },
    paginationTable: {
        "& .MuiTablePagination-selectLabel": {
            color: "#333",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "20.3px",
            letterSpacing: "0.21px"
        },
        "& .MuiTablePagination-input": {
            borderRadius: '8px',
            border: '1px solid #E6E6E6',
            width: '80px',
            paddingRight: '10px',
            marginRight: "24px",
            height: "30px"
        },
        "& .MuiTablePagination-displayedRows": {
            color: "#333",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "20.3px",
            letterSpacing: "0.21px"
        },
        "& .MuiTablePagination-spacer": {
            flex: 0
        },
        "& .MuiToolbar-root": {
            paddingLeft: "0px !important",
            paddingRight: "0px",
            width: "100%"
        },
    },
    paginationComponent: {
        color: "#333",
        fontWeight: 500,
        fontSize: "14px",
        width: "100%"
    },
}));

const getCellView = (data: any, columnProps: TableColumn) => {
    const { type, component, props } = columnProps;
    if (type === "custom" && component) {
        return component({ value: data, ...props });
    }
    switch (type) {
        case "number":
            return <NumberCell data={data} props={props} />;
        case "date":
            return <DateCell data={data} props={props} />;
        case "datetime":
            return <DateTimeCell data={data} props={props} />;
        case "currency":
            return <CurrencyCell data={data} props={props} />;
        default:
            return <StringCell data={data} props={props} />;
    }
};

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 25, 50];
const TableV1: React.FC<TableProps> = ({ schema, records }) => {
    const classes = useStyles();

    function TablePaginationActions(props: TablePaginationActionsProps) {
        const theme = useTheme();
        const { count, page, rowsPerPage, onPageChange } = props;
        const [inputPage, setInputPage] = useState(page + 1);

        const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onPageChange(event, 0);
        };

        const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onPageChange(event, page - 1);
        };

        const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onPageChange(event, page + 1);
        };

        const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
        };

        const handleInputPageChange = (event: any) => {
            setInputPage(parseInt(event.target.value, 10));
        };

        const handleInputBlur = (event: any) => {
            onPageChange(event, inputPage - 1);
        };

        return (
            <div className={`flex gap-x-6 justify-end ${classes.paginationComponent}`}  >
                <div className="flex gap-x-2.5">
                    <div className='my-auto'>Page</div>
                    <div className='my-auto'>
                        <Input
                            type="number"
                            value={inputPage}
                            onChange={handleInputPageChange}
                            onBlur={handleInputBlur}
                            disableUnderline={true}
                            inputProps={{ min: 1, max: Math.ceil(count / rowsPerPage) }}
                            style={{ width: '54px', height: "28px", borderRadius: '8px', border: '1px solid #E6E6E6', paddingLeft: '16px' }}
                        />
                    </div>
                    <div className='my-auto'>of {Math.ceil(count / rowsPerPage)}</div>
                </div>

                <div className='flex'>
                    <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                    </IconButton>
                    <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    </IconButton>
                    <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </IconButton>
                    <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
                        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                    </IconButton>
                </div>
            </div>
        );
    }

    const { total, isVisible, currentPage, limit, handleChangePage = () => { }, handleChangeRowsPerPage = () => { } } = schema.pagination;
    return (
        <div >
            {schema.title && <span className={`${classes.title} text-xl font-normal`}>{schema.title}</span>}
            <div className={`${classes.mainTableContainer} rounded-2xl box-border overflow-hidden`}>
                <table className={`w-full rounded-2xl ${classes.tableWrapper}`}>
                    <thead className={`${classes.header} text-sm text-left`}>
                        <tr className="h-12 text-center font-medium break-all">
                            {schema.columns.map((column, index) => (
                                <th className="px-2 last:pr-3 first:pl-3 font-medium break-words " key={index}>
                                    <div>{column.label.split("\n").map(label => <div>{label}</div>)}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`${classes.tableBody} text-sm font-normal`}>
                        {records.map((record) => (
                            <tr key={`row-${record[0]}`} className={`${classes.tableRow} text-center h-12`}>
                                {schema.columns.map((column, columnIndex) => (
                                    <td
                                        className={`last:pr-3 first:pl-3 ${classes.cellWrap}`}
                                        key={`col-${column.key}`}
                                    >
                                        {getCellView(record[columnIndex], column)}
                                    </td>

                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={!isVisible ? `hidden` : `flex`}>
                <TablePagination
                    className={`${classes.paginationTable} w-full mt-2 flex`}
                    component="div"
                    count={total}
                    page={currentPage}
                    rowsPerPage={limit}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    showLastButton
                    showFirstButton
                    labelRowsPerPage="Rows per page"
                    ActionsComponent={TablePaginationActions}
                />
            </div>

        </div>
    );
};
export default TableV1;