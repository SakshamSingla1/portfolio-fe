import React, { useState, useMemo } from "react";
import clsx from "clsx";
import TablePagination from "@mui/material/TablePagination";
import { createUseStyles } from "react-jss";

export type ColumnType = "text" | "number" | "date" | "custom";

export interface TableColumn {
  label: string;
  key: string;
  isSortable?: boolean;
  isFilterable?: boolean;
  component?: (props: any) => React.ReactNode;
  type: ColumnType;
  props?: { [key: string]: any };
  align?: "left" | "center" | "right";
  width?: string | number;
}

export interface TableSchema {
  id: string;
  title?: string;
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

/** ---- COLOR PALETTE ---- */
const colors = {
  primary50: "#E8F8F5",
  primary100: "#D1F2EB",
  primary200: "#A3E4D7",
  primary300: "#76D7C4",
  primary400: "#48C9B0",
  primary500: "#1ABC9C",
  primary600: "#17A589",
  primary700: "#148F77",
  primary800: "#0E6655",
  primary900: "#0B5345",
  primary950: "#073B32",
  primary960: "#E8F8F5",
};

/** ---- ENHANCED TABLE STYLES ---- */
const useStyles = createUseStyles({
  // Table container styles
  tableContainer: {
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${colors.primary200}`,
    backgroundColor: 'white',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  },
  
  // Header styles
  tableHeader: {
    backgroundColor: colors.primary50,
    color: colors.primary900,
    padding: '1rem 1.5rem',
    borderBottom: `1px solid ${colors.primary100}`,
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
    backgroundColor: colors.primary100,
    '& th': {
      padding: '0.75rem 1.25rem',
      textAlign: 'left',
      fontWeight: 600,
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: colors.primary800,
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
      borderBottom: `1px solid ${colors.primary100}`,
      color: colors.primary900,
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
    borderTop: `1px solid ${colors.primary100}`,
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
      color: colors.primary700,
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
        color: colors.primary300,
      },
    },
    '& .MuiTablePagination-select': {
      border: `1px solid ${colors.primary200}`,
      borderRadius: '0.375rem',
      padding: '0.25rem 1.75rem 0.25rem 0.5rem',
      '&:focus': {
        borderColor: colors.primary400,
        boxShadow: `0 0 0 1px ${colors.primary400}`,
      },
    },
  },
});

/** ---- GENERIC TABLE COMPONENT ---- */
const TableV1: React.FC<TableProps> = ({ schema, records, className, isRounded }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return records.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, records]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={clsx(classes.tableContainer, className)}>
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
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={schema.columns.length} 
                  className={classes.emptyState}
                >
                  No records found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className={clsx(
                    schema.hover && 'hover:opacity-90',
                    schema.striped && rowIndex % 2 === 0 && classes.stripedRow
                  )}
                >
                  {schema.columns.map((col, colIndex) => {
                    const cellValue = row[colIndex];
                    return (
                      <td
                        key={col.key}
                        style={{
                          textAlign: col.align || 'left',
                        }}
                      >
                        {col.component
                          ? col.component({ value: cellValue, row })
                          : cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {records.length > 0 && (
        <div className={classes.pagination}>
          <TablePagination
            component="div"
            count={records.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
            showFirstButton
            showLastButton
          />
        </div>
      )}
    </div>
  );
};

export default TableV1;
