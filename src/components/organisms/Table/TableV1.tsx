import React, { useState, useEffect } from "react";
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
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

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
  priority?: "high" | "medium" | "low";
  hideOnMobile?: boolean;
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
  mobileView?: "cards" | "scroll" | "responsive";
  maxMobileColumns?: number;
}

interface TableProps {
  schema: TableSchema;
  records: any[][];
  className?: string;
  isRounded?: boolean;
  onRowClick?: (row: any[]) => void;
  onRowSwipe?: (row: any[], direction: 'left' | 'right') => void;
}

const useStyles = createUseStyles((colors: any) => ({
  tableContainer: {
    borderRadius: '0.75rem',
    overflow: 'hidden',
    border: `1px solid ${colors.neutral200}`,
    backgroundColor: 'white',
    transition: 'all 0.2s ease-in-out',
  },
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
    '@media (max-width: 768px)': {
      padding: '0.75rem 1rem',
      '& h2': {
        fontSize: '1.125rem',
      },
    },
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    '@media (max-width: 768px)': {
      fontSize: '0.875rem',
    },
  },
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
      '@media (max-width: 768px)': {
        padding: '0.5rem 0.75rem',
        fontSize: '0.625rem',
      },
    },
  },
  tableBody: {
    '& tr': {
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: colors.primary50,
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
      '@media (max-width: 768px)': {
        '&:hover': {
          backgroundColor: colors.primary100,
          cursor: 'pointer',
        },
      },
    },
    '& td': {
      padding: '1rem 1.25rem',
      borderBottom: `1px solid ${colors.neutral200}`,
      color: colors.neutral700,
      fontSize: '0.875rem',
      lineHeight: '1.5',
      '@media (max-width: 768px)': {
        padding: '0.75rem',
        fontSize: '0.8125rem',
      },
    },
  },
  stripedRow: {
    backgroundColor: colors.primary50,
    '@media (max-width: 768px)': {
      backgroundColor: colors.primary25,
    },
  },
  emptyState: {
    padding: '3rem 1.5rem',
    textAlign: 'center',
    color: colors.primary600,
    fontSize: '0.9375rem',
    backgroundColor: 'white',
    '@media (max-width: 768px)': {
      padding: '2rem 1rem',
      fontSize: '0.875rem',
    },
  },
  pagination: {
    backgroundColor: 'white',
    borderTop: `1px solid ${colors.neutral200}`,
    padding: '0.15rem 1.0rem',
    display: 'flex',
    justifyContent: 'flex-end',
    '@media (max-width: 768px)': {
      padding: '0.5rem',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    '& .MuiTablePagination-toolbar': {
      padding: 0,
      minHeight: 'auto',
      flexWrap: 'wrap',
      '& > *': {
        margin: '0.25rem',
        '@media (max-width: 768px)': {
          margin: '0.125rem',
        },
      },
    },
    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
      margin: 0,
      fontSize: '0.75rem',
      color: colors.neutral700,
      '@media (max-width: 768px)': {
        textAlign: 'center',
      },
    },
    '& .MuiTablePagination-actions': {
      marginLeft: '0.5rem',
      '@media (max-width: 768px)': {
        marginLeft: 0,
        justifyContent: 'center',
      },
    },
    '& .MuiButtonBase-root': {
      color: colors.primary700,
      '&:hover': {
        backgroundColor: colors.primary100,
      },
      '&.Mui-disabled': {
        color: colors.neutral400,
      },
      '@media (max-width: 768px)': {
        padding: '0.25rem',
        minWidth: '2rem',
      },
    },
    '& .MuiTablePagination-select': {
      border: `1px solid ${colors.neutral200}`,
      borderRadius: '0.375rem',
      '@media (max-width: 768px)': {
        fontSize: '0.75rem',
      },
    },
  },
  mobileScrollContainer: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '@media (min-width: 769px)': {
      overflowX: 'visible',
    },
  },
  mobileCardContainer: {
    padding: '0.75rem',
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  mobileCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: `1px solid ${colors.neutral200}`,
    padding: '0',
    marginBottom: '0.75rem',
    cursor: 'pointer',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  mobileCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: `1px solid ${colors.neutral100}`,
    cursor: 'pointer',
    userSelect: 'none',
  },
  mobileCardTitle: {
    fontWeight: 600,
    color: colors.primary700,
    fontSize: '0.875rem',
    flex: 1,
  },
  mobileCardValue: {
    color: colors.neutral800,
    fontSize: '0.8125rem',
    flex: 1,
    textAlign: 'right',
  },
  mobileCardDropdownArrow: {
    display: 'flex',
    alignItems: 'center',
    color: colors.primary600,
    marginLeft: '8px',
  },
  mobileCardContent: {
    padding: '0',
    overflow: 'hidden',
  },
  mobileCardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '0.75rem 1rem',
    borderBottom: `1px solid ${colors.neutral50}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  mobileCardLabel: {
    fontWeight: 500,
    color: colors.neutral600,
    fontSize: '0.75rem',
    minWidth: '80px',
    marginRight: '0.5rem',
  },
  mobileCardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    borderTop: `1px solid ${colors.neutral100}`,
  },
  desktopTable: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  swipeIndicator: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    backgroundColor: colors.primary500,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    pointerEvents: 'none',
  },
  swipeIndicatorLeft: {
    left: '0.5rem',
  },
  swipeIndicatorRight: {
    right: '0.5rem',
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
    <div className="flex items-center justify-end">
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        style={{ color: colors.primary700 }}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        style={{ color: colors.primary700 }}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        style={{ color: colors.primary700 }}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        style={{ color: colors.primary700 }}
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

const TableV1: React.FC<TableProps> = ({
  schema,
  records,
  className,
  onRowClick,
}) => {
  const colors = useColors();
  const classes = useStyles({ theme: colors });
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const { total, isVisible, currentPage, limit, handleChangePage = () => { }, handleChangeRowsPerPage = () => { } } = schema.pagination;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleCardExpansion = (rowIndex: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  };

  const getMobileColumns = () => {
    const maxColumns = schema.maxMobileColumns || 3;
    return schema.columns
      .filter(col => !col.hideOnMobile)
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority || 'medium'];
        const bPriority = priorityOrder[b.priority || 'medium'];
        return bPriority - aPriority;
      })
      .slice(0, maxColumns);
  };

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

  const mobileView = schema.mobileView || 'cards';
  const mobileColumns = getMobileColumns();

  const renderMobileCard = (row: any[], rowIndex: number) => {
    const primaryColumn = schema.columns.find(col => col.priority === 'high') || schema.columns[0];
    const primaryValue = getCellView(row[schema.columns.indexOf(primaryColumn)], primaryColumn);
    const isExpanded = expandedCards.has(rowIndex);

    return (
      <div
        key={rowIndex}
        className={classes.mobileCard}
        style={{ position: 'relative' }}
      >
        <div
          className={classes.mobileCardHeader}
          onClick={() => toggleCardExpansion(rowIndex)}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <div className={classes.mobileCardTitle}>
            {primaryColumn.label}
          </div>
          <div className={classes.mobileCardValue}>
            {primaryValue}
          </div>
          <div className={classes.mobileCardDropdownArrow}>
            <span
              style={{
                display: 'inline-block'
              }}
            >
              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </span>
          </div>
        </div>

        <div
          className={classes.mobileCardContent}
          style={{
            maxHeight: isExpanded ? '500px' : '0',
            opacity: isExpanded ? 1 : 0,
            padding: isExpanded ? '0 0 1rem 0' : '0',
            transition: 'all 0.3s ease'
          }}
        >
          {schema.columns.filter(col => col.key !== primaryColumn.key).map((col) => {
            const originalIndex = schema.columns.indexOf(col);
            return (
              <div key={col.key} className={classes.mobileCardRow}>
                <div className={classes.mobileCardLabel}>
                  {col.label}
                </div>
                <div className={classes.mobileCardValue}>
                  {getCellView(row[originalIndex], col)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`${classes.tableContainer} ${className}`}>
      {schema.title && (
        <div className={classes.tableHeader}>
          <h2>{schema.title}</h2>
        </div>
      )}
      {isMobile && mobileView === 'cards' && (
        <div className={classes.mobileCardContainer}>
          {records.length === 0 ? (
            <div className={classes.emptyState}>
              No records found
            </div>
          ) : (
            records.map((row, rowIndex) => renderMobileCard(row, rowIndex))
          )}
        </div>
      )}
      {(!isMobile || mobileView === 'scroll' || mobileView === 'responsive') && (
        <div className={clsx(
          mobileView === 'scroll' && classes.mobileScrollContainer,
          mobileView === 'responsive' && isMobile && classes.mobileScrollContainer
        )}>
          <table className={clsx(classes.table, (!isMobile || mobileView !== 'cards') && classes.desktopTable)}>
            <thead className={classes.tableHead}>
              <tr>
                {(isMobile && mobileView !== 'cards' ? mobileColumns : schema.columns).map((col) => (
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
                    colSpan={(isMobile && mobileView !== 'cards' ? mobileColumns : schema.columns).length}
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
                    onClick={() => onRowClick?.(row)}
                  >
                    {(isMobile && mobileView !== 'cards' ? mobileColumns : schema.columns).map((col) => {
                      const originalIndex = schema.columns.indexOf(col);
                      return (
                        <td
                          key={col.key}
                          style={{
                            textAlign: col.align || 'left',
                          }}
                        >
                          {getCellView(row[originalIndex], col)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isVisible && (
        <div className={classes.pagination}>
          <TablePagination
            component="div"
            count={total}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={limit}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={isMobile ? [5, 10, 25] : [5, 10, 25, 50]}
            labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
            ActionsComponent={TablePaginationActions}
            className="flex items-center justify-end"
          />
        </div>
      )}
    </div>
  );
};

export default TableV1;