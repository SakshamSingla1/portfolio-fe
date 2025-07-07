import React from "react";
import { createUseStyles } from "react-jss";
import DateTimeCell from "../../atoms/TableUtils/DateTimeCell";
import CurrencyCell from "../../atoms/TableUtils/CurrencyCell";
import NumberCell from "../../atoms/TableUtils/NumberCell";
import StringCell from "../../atoms/TableUtils/StringCell";
import DateCell from "../../atoms/TableUtils/DateCell";

export type ColumnType = "number" | "string" | "date" | "datetime" | "custom" | "currency";

export interface TableColumn {
    label: string;
    key: string;
    isSortable?: boolean;
    isFilterable?: boolean;
    component?: (props: any) => React.ReactNode;
    type: ColumnType;
    props: { [key: string]: any };
    align?: 'left' | 'center' | 'right';
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
}

const useStyles = createUseStyles({
    tableContainer: {
        width: '100%',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
    },
    header: {
        backgroundColor: '#F8FAFC',
        '& th': {
            fontWeight: 600,
            color: '#1E293B',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid #E2E8F0',
            '&:first-child': {
                borderTopLeftRadius: '8px',
            },
            '&:last-child': {
                borderTopRightRadius: '8px',
            },
        },
    },
    body: {
        '& tr': {
            transition: 'background-color 0.2s ease',
            '&:hover': {
                backgroundColor: '#F8FAFC',
            },
            '&:last-child td': {
                borderBottom: 'none',
            },
        },
        '& tr:nth-child(odd)': {
            backgroundColor: '#fff',
        },
        '& tr:nth-child(even)': {
            backgroundColor: '#F8FAFC',
        },
    },
    cell: {
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #E2E8F0',
        fontSize: '0.875rem',
        color: '#334155',
        '&:first-child': {
            paddingLeft: '1.5rem',
        },
        '&:last-child': {
            paddingRight: '1.5rem',
        },
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#1E293B',
        marginBottom: '1rem',
        padding: '0 0.5rem',
    },
    emptyState: {
        padding: '3rem 1rem',
        textAlign: 'center',
        color: '#64748B',
        '& svg': {
            fontSize: '3rem',
            marginBottom: '1rem',
            opacity: 0.5,
        },
    },
});

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

const TableV1: React.FC<TableProps> = ({ schema, records, className = '' }) => {
    const classes = useStyles();

    const getAlignment = (align?: 'left' | 'center' | 'right') => {
        switch (align) {
            case 'left': return 'text-left';
            case 'right': return 'text-right';
            case 'center':
            default:
                return 'text-center';
        }
    };

    return (
        <div className={className}>
            {schema.title && <div className={classes.title}>{schema.title}</div>}
            <div className={classes.tableContainer}>
                <div className="overflow-x-auto">
                    <table className={classes.table}>
                        <thead className={classes.header}>
                            <tr>
                                {schema.columns.map((column, index) => (
                                    <th 
                                        key={`${schema.id}-header-${index}`}
                                        className={`${classes.cell} ${getAlignment(column.align)}`}
                                        style={{ width: column.width || 'auto' }}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={classes.body}>
                            {records.length > 0 ? (
                                records.map((row, rowIndex) => (
                                    <tr 
                                        key={`${schema.id}-row-${rowIndex}`}
                                        className={`${schema.hover ? 'hover:bg-blue-50' : ''} ${
                                            schema.striped && rowIndex % 2 === 0 ? 'bg-gray-50' : ''
                                        }`}
                                    >
                                        {schema.columns.map((column, colIndex) => (
                                            <td 
                                                key={`${schema.id}-cell-${rowIndex}-${colIndex}`}
                                                className={`${classes.cell} ${getAlignment(column.align)}`}
                                            >
                                                {getCellView(row[colIndex], column)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={schema.columns.length} className={classes.emptyState}>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-12 w-12 mx-auto mb-4 text-gray-400" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={1.5} 
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                                            />
                                        </svg>
                                        <p>No data available</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableV1;