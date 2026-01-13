import React from "react";
import TablePagination from '@mui/material/TablePagination';
import { createUseStyles } from "react-jss";
import { useColors } from "../../../utils/types";
import { clsx } from "clsx";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { IconButton } from '@mui/material';
import DateCell from "../../atoms/TableUtils/DateCell";
import CurrencyCell from "../../atoms/TableUtils/CurrencyCell";
import NumberCell from "../../atoms/TableUtils/NumberCell";
import StringCell from "../../atoms/TableUtils/StringCell";
import DateTimeCell from "../../atoms/TableUtils/DateTimeCell";
export interface Pagination {
  limit: number;
  isVisible: boolean;
  currentPage: number;
  total: number;
  handleChangePage?: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export type ColumnType = "number" | "string" | "date" | "datetime" | "custom" | "currency";
export interface TableColumn {
  label: string;
  key: string;
  isSortable?: boolean;
  isFilterable?: boolean;
  component?: (props: any) => React.ReactNode;
  type: ColumnType;
  props: { [key: string]: any };
  align?: "left" | "center" | "right";
  width?: string | number;
}
export interface TableSchema {
  id: string;
  title?: string;
  pagination: Pagination;
  sort?: {
    sortBy: "asc" | "desc";
    sortOn: string;
  };
  filter?: {
    [key: string]: any;
  };
  columns: TableColumn[];
  stickyHeader?: boolean;
  hover?: boolean;
  striped?: boolean;
}
interface TableProps {
  schema: TableSchema;
  records: any[][];
  className?: string;
  isRounded?: boolean;
}
const useStyles = createUseStyles((colors: any) => ({
  // Table container styles
  tableContainer: {
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${colors.neutral200}`,
    backgroundColor: 'white',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  },
  
  // Header styles
  tableHeader: {
    backgroundColor: colors.primary50,
    color: colors.primary700,
    padding: '1rem 1.5rem',
    borderBottom: `1px solid ${colors.neutral200}`,
    '& h2': {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 600,
    },
  },
  
  // Table styles
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
  },
  
  // Table head styles
  tableHead: {
    backgroundColor: colors.primary50,
    '& th': {
      padding: '0.75rem 1.25rem',
      textAlign: 'left',
      fontWeight: 600,
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: colors.primary700,
      borderBottom: `2px solid ${colors.primary200}`,
      '&:first-child': {
        borderTopLeftRadius: '0.5rem',
      },
      '&:last-child': {
        borderTopRightRadius: '0.5rem',
      },
    },
  },
  
  // Table body styles
  tableBody: {
    '& tr': {
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(209, 242, 235, 0.3)',
      },
      '&:last-child td': {
        borderBottom: 'none',
        '&:first-child': {
          borderBottomLeftRadius: '0.5rem',
        },
        '&:last-child': {
          borderBottomRightRadius: '0.5rem',
        },
      },
    },
    '& td': {
      padding: '1rem 1.25rem',
      borderBottom: `1px solid ${colors.neutral200}`,
      color: colors.neutral700,
      fontSize: '0.875rem',
      lineHeight: '1.5',
    },
  },
  
  // Striped rows
  stripedRow: {
    backgroundColor: colors.primary50,
  },
  
  // Empty state
  emptyState: {
    padding: '3rem 1.5rem',
    textAlign: 'center',
    color: colors.primary600,
    fontSize: '0.9375rem',
    backgroundColor: 'white',
  },
  
  // Pagination styles
  pagination: {
    backgroundColor: 'white',
    borderTop: `1px solid ${colors.neutral200}`,
    padding: '0.75rem 1.5rem',
    '& .MuiTablePagination-toolbar': {
      padding: 0,
      minHeight: 'auto',
      flexWrap: 'wrap',
      '& > *': {
        margin: '0.25rem',
      },
    },
    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
      margin: 0,
      fontSize: '0.875rem',
      color: colors.neutral700,
    },
    '& .MuiTablePagination-actions': {
      marginLeft: '0.5rem',
    },
    '& .MuiButtonBase-root': {
      color: colors.primary700,
      '&:hover': {
        backgroundColor: colors.primary100,
      },
      '&.Mui-disabled': {
        color: colors.neutral400,
      },
    },
    '& .MuiTablePagination-select': {
      border: `1px solid ${colors.neutral200}`,
      borderRadius: '0.375rem',
      padding: '0.25rem 1.75rem 0.25rem 0.5rem',
      '&:focus': {
        borderColor: colors.primary400,
        boxShadow: `0 0 0 1px ${colors.primary400}`,
      },
    },
  },
}));
function TablePaginationActions(props: any) {
  const { count, page, rowsPerPage, onPageChange } = props;
  const colors = useColors();
  const handleFirstPageButtonClick = (event: any) => {
    onPageChange(event, 0);
  };
  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };
  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };
  const handleLastPageButtonClick = (event: any) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        style={{ color: colors.primary700 }}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        style={{ color: colors.primary700 }}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        style={{ color: colors.primary700 }}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        style={{ color: colors.primary700 }}
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}
const TableV1: React.FC<TableProps> = ({ schema, records, className, isRounded = true }) => {
  const colors = useColors();
  const classes = useStyles({ theme: colors });
  const { total, isVisible, currentPage, limit, handleChangePage = () => {}, handleChangeRowsPerPage = () => {} } = schema.pagination;
  const centerColumns: number[] = [];
  schema.columns.forEach((col, index) => {
    if (["status", "action"].includes(col.key)) centerColumns.push(index);
  });
  const getCellView = (data: any, columnProps: TableColumn) => {
    const { type, component, props } = columnProps;
  
    if (type === "custom" && component) {
      return component({ value: data, ...props });
    }
  
    switch (type) {
      case "number": return <NumberCell data={data} props={props} />;
      case "date": return <DateCell data={data} props={props} />;
      case "datetime": return <DateTimeCell data={data} props={props} />;
      case "currency": return <CurrencyCell data={data} props={props} />;
      default: return <StringCell data={data} props={props} />;
    }
  };
  return (
    <div className={clsx(classes.tableContainer, className, { 'rounded-2xl': isRounded })}>
      {schema.title && (
        <div className={classes.tableHeader}>
          <h2>{schema.title}</h2>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className={classes.table}>
          <thead className={classes.tableHead}>
            <tr>
              {schema.columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: col.align || 'left',
                    width: col.width || 'auto',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={classes.tableBody}>
            {records.length === 0 ? (
              <tr>
                <td 
                  colSpan={schema.columns.length} 
                  className={classes.emptyState}
                >
                  No records found
                </td>
              </tr>
            ) : (
              records.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className={clsx(
                    schema.hover && 'hover:opacity-90',
                    schema.striped && rowIndex % 2 === 0 && classes.stripedRow
                  )}
                >
                  {schema.columns.map((col, colIndex) => (
                    <td
                      key={col.key}
                      style={{
                        textAlign: col.align || 'left',
                      }}
                    >
                      {getCellView(row[colIndex], col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isVisible && (
        <div className={classes.pagination}>
          <TablePagination
            component="div"
            count={total}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={limit}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Rows per page:"
            ActionsComponent={TablePaginationActions}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
export default TableV1;
