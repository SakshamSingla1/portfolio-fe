import React, { useState } from "react";
import TablePagination from '@mui/material/TablePagination';
import { createUseStyles } from "react-jss";
import { IconButton, Input } from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { clsx } from "clsx";
import { useColors } from "../../../utils/types";

import NumberCell from "../../atoms/TableUtils/NumberCell";
import DateCell from "../../atoms/TableUtils/DateCell";
import DateTimeCell from "../../atoms/TableUtils/DateTimeCell";
import CurrencyCell from "../../atoms/TableUtils/CurrencyCell";
import StringCell from "../../atoms/TableUtils/StringCell";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
}

export interface TableSchema {
    id: string;
    rowKey?: string;
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
    records: Record<string, any>[];
    setRecords?: React.Dispatch<React.SetStateAction<any[]>>;
    onReorder?: (newRecords: Record<string, any>[]) => void;
    showCheckboxes: boolean;
    selected: Record<string, any>[];
    setSelected: React.Dispatch<React.SetStateAction<any[]>>;
    scroll?: {
        x?: string | number;
        y?: string | number;
    };
    disableCondition?: (record: Record<string, any>) => boolean;
    isRounded?: boolean;
    className?: string;
}

const useStyles = createUseStyles((colors: any) => ({
    tableContainer: {
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: `1px solid ${colors.neutral200 || '#e0e5eb'}`,
        backgroundColor: 'white',
        transition: 'all 0.2s ease-in-out',
        width: '100%',
    },
    tableHeader: {
        backgroundColor: colors.primary50 || '#f3f5f780',
        padding: '1rem 1.5rem',
        borderBottom: `1px solid ${colors.neutral200 || '#e0e5eb'}`,
        '& h2': {
            color: colors.primary700 || '#333',
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: 600,
        }
    },
    tableWrapper: {
        overflowX: "auto",
        width: "100%",
        borderCollapse: 'separate',
        borderSpacing: 0,
    },
    header: {
        backgroundColor: colors.primary50 || '#f3f5f780',
        '& th': {
            padding: '0.75rem 1.25rem',
            textAlign: 'left',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: colors.primary700 || '#333',
            borderBottom: `2px solid ${colors.primary200 || '#e0e5eb'}`,
            '&:first-child': {
                borderTopLeftRadius: '0.5rem',
            },
            '&:last-child': {
                borderTopRightRadius: '0.5rem',
            },
        }
    },
    tableBody: {
        color: colors.neutral700 || '#333',
        '& td': {
            padding: '1rem 1.25rem',
            borderBottom: `1px solid ${colors.neutral200 || '#e0e5eb'}`,
            fontSize: '0.875rem',
            lineHeight: '1.5',
        }
    },
    tableRow: {
        transition: 'background-color 0.2s ease',
        backgroundColor: 'white',
        '&:last-child td': {
            borderBottom: 'none'
        }
    },
    hoverRow: {
        '&:hover': {
            backgroundColor: `${colors.primary50 || '#f3f5f7'} !important`,
        }
    },
    stripedRow: {
        backgroundColor: colors.primary50 || '#f9fafb',
    },
    emptyState: {
        padding: '3rem 1.5rem',
        textAlign: 'center',
        color: colors.primary600 || '#666',
        fontSize: '0.9375rem',
        backgroundColor: 'white',
    },
    pagination: {
        backgroundColor: 'white',
        borderTop: `1px solid ${colors.neutral200 || '#e0e5eb'}`,
        padding: '0.15rem 1.0rem',
        display: 'flex',
        justifyContent: 'flex-end',
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            margin: 0,
            fontSize: '0.75rem',
            color: colors.neutral700 || '#333'
        },
        "& .MuiTablePagination-input": {
            border: `1px solid ${colors.neutral200 || '#e0e5eb'}`,
            borderRadius: '0.375rem',
            marginRight: "24px",
            height: "30px",
            padding: '0 8px'
        },
        "& .MuiTablePagination-spacer": {
            flex: 0
        },
        "& .MuiToolbar-root": {
            paddingLeft: "0px !important",
            paddingRight: "0px",
            width: "100%",
            justifyContent: 'flex-end'
        },
    },
    checkedInputColor: {
        color: colors.primary400 || '#1976d2',
        '&.Mui-checked': {
            color: colors.primary500 || '#1565c0',
        },
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

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 25];

interface SortableRowProps {
    id: string;
    disabled?: boolean;
    className?: string;
    children: (props: { attributes: any, listeners: any }) => React.ReactNode;
}

const SortableRow = ({ id, disabled, className, children }: SortableRowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { backgroundColor: '#f0f0f0', zIndex: 50, opacity: 0.9, position: 'relative' as any } : {})
    };

    return (
        <tr ref={setNodeRef} style={style} className={className}>
            {children({ attributes, listeners })}
        </tr>
    );
};

const TableV2: React.FC<TableProps> = ({ 
    schema, 
    records, 
    setRecords, 
    onReorder, 
    showCheckboxes, 
    selected, 
    setSelected, 
    scroll, 
    disableCondition, 
    isRounded = true,
    className 
}) => {
    const colors = useColors();
    const classes = useStyles({ theme: colors });

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
            let val = inputPage;
            if (val < 1) val = 1;
            if (val > Math.ceil(count / rowsPerPage)) val = Math.ceil(count / rowsPerPage);
            setInputPage(val);
            onPageChange(event, val - 1);
        };

        return (
            <div className={`flex gap-x-6 justify-end items-center`}>
                <div className="flex gap-x-2.5 items-center text-xs text-gray-600 font-medium">
                    <div>Page</div>
                    <div>
                        <Input
                            type="number"
                            value={inputPage}
                            onChange={handleInputPageChange}
                            onBlur={handleInputBlur}
                            disableUnderline={true}
                            inputProps={{ min: 1, max: Math.ceil(count / rowsPerPage) }}
                            style={{ 
                                width: '54px', 
                                height: "28px", 
                                borderRadius: '8px', 
                                border: `1px solid ${colors.neutral200 || '#E6E6E6'}`, 
                                paddingLeft: '8px',
                                fontSize: '14px',
                                backgroundColor: 'white'
                            }}
                        />
                    </div>
                    <div>of {Math.max(1, Math.ceil(count / rowsPerPage))}</div>
                </div>

                <div className='flex items-center'>
                    <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} style={{ color: page === 0 ? colors.neutral400 : colors.primary700 }}>
                        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                    </IconButton>
                    <IconButton onClick={handleBackButtonClick} disabled={page === 0} style={{ color: page === 0 ? colors.neutral400 : colors.primary700 }}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    </IconButton>
                    <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} style={{ color: page >= Math.ceil(count / rowsPerPage) - 1 ? colors.neutral400 : colors.primary700 }}>
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </IconButton>
                    <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} style={{ color: page >= Math.ceil(count / rowsPerPage) - 1 ? colors.neutral400 : colors.primary700 }}>
                        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                    </IconButton>
                </div>
            </div>
        );
    }

    const tableStyle: React.CSSProperties = {
        minWidth: scroll?.x ? "100%" : "auto",
        width: scroll?.x
            ? typeof scroll.x === "number"
                ? `${scroll.x}px`
                : scroll.x
            : "100%",
        tableLayout: "fixed",
    };

    const wrapperStyle: React.CSSProperties = {
        maxHeight: scroll?.y
            ? typeof scroll.y === "number"
                ? `${scroll.y}px`
                : scroll.y
            : "none",
        overflow: scroll?.y || scroll?.x ? "auto" : "visible",
    };

    const { total, isVisible, currentPage, limit, handleChangePage = () => { }, handleChangeRowsPerPage = () => { } } = schema.pagination;

    const rowKey = schema.rowKey || schema.columns[0]?.key;

    const toggleSelection = (record: Record<string, any>) => {
        if (record.isGroupHeader) return;
        const recordId = record[rowKey];
        setSelected((prev) => {
            const exists = prev.some(
                (item) => item[rowKey] === recordId
            );
            return exists
                ? prev.filter((item) => item[rowKey] !== recordId)
                : [...prev, record];
        });
    };

    const selectableRecords = records.filter(
        (record) => !record.isGroupHeader && !disableCondition?.(record)
    );

    const isAllSelectedOnPage =
        selectableRecords.length > 0 &&
        selectableRecords.every((record) =>
            selected.some(
                (item) => item[rowKey] === record[rowKey]
            )
        );

    const handleSelectAll = () => {
        if (isAllSelectedOnPage) {
            setSelected((prev) =>
                prev.filter(
                    (item) =>
                        !selectableRecords.some(
                            (record) => record[rowKey] === item[rowKey]
                        )
                )
            );
        } else {
            setSelected((prev) => {
                const newSelected = [...prev];

                selectableRecords.forEach((record) => {
                    if (
                        !newSelected.some(
                            (item) => item[rowKey] === record[rowKey]
                        )
                    ) {
                        newSelected.push(record);
                    }
                });
                return newSelected;
            });
        }
    };

    const isReorderable = !!(setRecords || onReorder);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = records.findIndex((item) => item[rowKey] === active.id);
            const newIndex = records.findIndex((item) => item[rowKey] === over.id);

            const newRecords = arrayMove(records, oldIndex, newIndex);
            if (setRecords) {
                setRecords(newRecords);
            }
            if (onReorder) {
                onReorder(newRecords);
            }
        }
    };

    const renderHeader = () => {
        const stickyLeftCheckbox = isReorderable ? "left-[32px]" : "left-0";
        const stickyLeftFirstColumn = isReorderable && showCheckboxes ? "left-[80px]" : isReorderable && !showCheckboxes ? "left-[32px]" : !isReorderable && showCheckboxes ? "left-[48px]" : "left-0";

        return (
            <thead className={clsx(classes.header, "text-sm text-left align-middle", schema.stickyHeader && "sticky top-0 z-40")}>
                <tr className="h-12 break-all">
                    {isReorderable && (
                        <th className={clsx(classes.header, schema.stickyHeader && "sticky top-0 z-40", `sticky left-0 w-[32px] min-w-[32px] max-w-[32px] p-0`)}></th>
                    )}
                    {showCheckboxes && (
                        <th className={clsx(classes.header, schema.stickyHeader && "sticky top-0 z-40", `sticky ${stickyLeftCheckbox} w-[48px] min-w-[48px] max-w-[48px] p-0`)}>
                            <div className="flex items-center justify-center w-full h-full">
                                <Checkbox
                                    className={classes.checkedInputColor}
                                    checked={isAllSelectedOnPage}
                                    onChange={handleSelectAll}
                                    size="small"
                                    style={{ color: isAllSelectedOnPage ? colors.primary500 : colors.primary400 }}
                                />
                            </div>
                        </th>
                    )}
                    {schema.columns.map((column, index) => {
                        const isFirstColumn = index === 0;
                        return (
                            <th
                                key={index}
                                className={clsx(
                                    classes.header, 
                                    schema.stickyHeader && "sticky top-0 z-40",
                                    isFirstColumn && `sticky ${stickyLeftFirstColumn}`
                                )}
                            >
                                {column.label}
                            </th>
                        );
                    })}
                </tr>
            </thead>
        );
    };

    const renderRows = (isReorderableCtx: boolean) => {
        const stickyLeftCheckbox = isReorderable ? "left-[32px]" : "left-0";
        const stickyLeftFirstColumn = isReorderable && showCheckboxes ? "left-[80px]" : isReorderable && !showCheckboxes ? "left-[32px]" : !isReorderable && showCheckboxes ? "left-[48px]" : "left-0";
        
        if (records.length === 0) {
            return (
                <tr>
                    <td 
                        colSpan={schema.columns.length + (showCheckboxes ? 1 : 0) + (isReorderable ? 1 : 0)} 
                        className={classes.emptyState}
                    >
                        No records found
                    </td>
                </tr>
            )
        }

        return records.map((record, rowIndex) => {
            if (record.isGroupHeader) {
                return (
                    <tr
                        key={`group-${schema.id}-${record.groupKey}`}
                        className={`text-base font-medium h-12 ${record.colorClass || "bg-gray-100 text-gray-700"}`}
                    >
                        <td colSpan={schema.columns.length + (showCheckboxes ? 1 : 0) + (isReorderable ? 1 : 0)} className="p-2 text-left h-12">
                            {record.label}
                        </td>
                    </tr>
                );
            }

            const isStriped = schema.striped && rowIndex % 2 === 0;
            const trClassName = clsx(
                classes.tableRow,
                "text-center h-12 align-middle",
                schema.hover && classes.hoverRow,
                isStriped && classes.stripedRow
            );

            const rowContent = (attributes?: any, listeners?: any) => (
                <>
                    {isReorderable && (
                        <td className={`sticky left-0 z-30 w-[32px] min-w-[32px] max-w-[32px] p-0 align-middle ${isStriped ? classes.stripedRow : 'bg-white'}`}>
                            {disableCondition?.(record) ? null : (
                                <div {...attributes} {...listeners} className="cursor-grab hover:text-gray-700 text-gray-400 flex items-center justify-center w-full h-full">
                                    <DragIndicatorIcon fontSize="small" />
                                </div>
                            )}
                        </td>
                    )}
                    {showCheckboxes && (
                        <td className={`sticky ${stickyLeftCheckbox} z-30 w-[48px] min-w-[48px] max-w-[48px] p-0 align-middle ${isStriped ? classes.stripedRow : 'bg-white'}`}>
                            <div className="flex items-center justify-center w-full h-full ">
                                <Checkbox
                                    className={`${classes.checkedInputColor} ${disableCondition?.(record) ? "cursor-not-allowed !opacity-50" : "cursor-pointer !opacity-100"} `}
                                    checked={selected.some(item => item[rowKey] === record[rowKey])}
                                    onChange={() => !disableCondition?.(record) && toggleSelection(record)}
                                    size="small"
                                    disabled={disableCondition?.(record)}
                                />
                            </div>
                        </td>
                    )}
                    {schema.columns.map((column, columnIndex) => (
                        <td
                            key={column.key}
                            className={`px-3 text-left align-middle ${columnIndex === 0 ? `sticky ${stickyLeftFirstColumn} z-20 ${isStriped ? classes.stripedRow : 'bg-white'}` : ""}`}
                        >
                            {getCellView(record[column.key], column)}
                        </td>
                    ))}
                </>
            );

            if (isReorderableCtx && !disableCondition?.(record)) {
                return (
                    <SortableRow key={`row-${record[rowKey]}`} id={record[rowKey]} className={trClassName} disabled={disableCondition?.(record)}>
                        {({ attributes, listeners }) => rowContent(attributes, listeners)}
                    </SortableRow>
                );
            }

            return (
                <tr key={`row-${record[rowKey]}`} className={trClassName}>
                    {rowContent()}
                </tr>
            );
        });
    };

    const tableContent = (
        <table className={classes.tableWrapper} style={tableStyle}>
            {renderHeader()}
            <tbody className={classes.tableBody}>
                {isReorderable ? (
                    <SortableContext items={records.map((r) => r[rowKey])} strategy={verticalListSortingStrategy}>
                        {renderRows(true)}
                    </SortableContext>
                ) : (
                    renderRows(false)
                )}
            </tbody>
        </table>
    );

    return (
        <div className={clsx(classes.tableContainer, className, isRounded && "rounded-2xl")}>
            {schema.title && (
                <div className={classes.tableHeader}>
                    <h2>{schema.title}</h2>
                </div>
            )}
            <div className="box-border overflow-hidden" style={wrapperStyle}>
                {isReorderable ? (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        {tableContent}
                    </DndContext>
                ) : (
                    tableContent
                )}
            </div>
            {isVisible && (
                <div className={classes.pagination}>
                    <TablePagination
                        component="div"
                        count={total}
                        page={currentPage}
                        rowsPerPage={limit}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        showLastButton={false}
                        showFirstButton={false}
                        labelRowsPerPage="Rows per page:"
                        ActionsComponent={TablePaginationActions}
                        className="flex items-center"
                    />
                </div>
            )}
        </div>
    );
};

export default TableV2;
