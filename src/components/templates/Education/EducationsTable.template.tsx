import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import TableV1 from '../../organisms/TableV1/TableV1';
import { type ColumnType } from '../../organisms/TableV1/TableV1';
import { ADMIN_ROUTES, DEGREE_OPTIONS } from '../../../utils/constant';
import { convertToCamelCase, makeRoute, OptionToValue, titleModification } from '../../../utils/helper';
import { type IPagination } from '../../../utils/types';
import { type Education } from '../../../services/useEducationService';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
    actionButton: {
        color: theme.palette.background.primary.primary500,
    },
    error: {
        backgroundColor: theme.palette.background.secondary.secondary500,
        color: theme.palette.background.secondary.secondary500
    } 
}));

interface IEducationListTemplateProps {
    educations: Education[];
    pagination: IPagination;
    handlePaginationChange: any;
    handleRowsPerPageChange: any;
    filters: any;
}

const EducationsTableTemplate: React.FC<IEducationListTemplateProps> = ({ educations, pagination, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const classes = useStyles();
    const navigate = useNavigate();

    const handleEditClick = (id : number) => {
        const query = {
            page: pagination.currentPage,
            size: pagination.pageSize,
            search: filters.search,
        };
        navigate(makeRoute(ADMIN_ROUTES.EDUCATION_EDIT, { query: { ...query }, params: { id } }));
    }

    const handleViewClick = (id : number) => {
        const query = {
            page: pagination.currentPage,
            size: pagination.pageSize,
            search: filters.search,
        };
        navigate(makeRoute(ADMIN_ROUTES.EDUCATION_VIEW, { query: { ...query }, params: { id } }));
    }

    const getSchema = () => ({
        id: "1",
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: handlePaginationChange,
            handleChangeRowsPerPage: handleRowsPerPageChange
        },
        columns: getTableColumns() ?? []
    });

    const getRecords = () => educations?.map((education: Education, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        OptionToValue(DEGREE_OPTIONS, education.degree),
        education.fieldOfStudy,
        education.institution,
        education.location,
        education.startYear + " - " + education.endYear,
        education.grade?.trim().split(" ")[1] === "Percentage" ? education.grade?.trim().split(" ")[0] + "%" : education.grade,
        Action(Number(education.id))
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { align: "center" } },
        { label: "Degree", key: "degree", type: "string" as ColumnType, props: {} },
        { label: "Field of Study", key: "fieldOfStudy", type: "string" as ColumnType, props: {} },
        { label: "Institution", key: "institution", type: "string" as ColumnType, props: {} },
        { label: "Location", key: "location", type: "string" as ColumnType, props: {} },
        { label: "Duration", key: "duration", type: "string" as ColumnType, props: { align: "center" } },
        { label: "Grade", key: "grade", type: "string" as ColumnType, props: { align: "center" } },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { align: "center" } },
      ];
      

    const Action = (id : number) => {
        if (id) {
            return (
                <div title=''>
                    <button onClick={() => handleViewClick(id)}><div className={`ml-2 ${classes.actionButton} text-lg`}>
                        <FiEye className={`ml-2 ${classes.actionButton} text-lg`} />
                    </div></button>
                    <button onClick={() => handleEditClick(id)}> <LiaEdit className={`ml-2 ${classes.actionButton} text-lg`} /></button>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <TableV1 schema={getSchema()} records={getRecords()} />
        </div>
    )
}

export default EducationsTableTemplate;
