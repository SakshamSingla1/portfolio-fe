import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import TableV1 from '../../organisms/TableV1/TableV1';
import { type ColumnType } from '../../organisms/TableV1/TableV1';
import { ADMIN_ROUTES, DEGREE_OPTIONS } from '../../../utils/constant';
import { convertToCamelCase, makeRoute, OptionToValue, titleModification } from '../../../utils/helper';
import { type IPagination } from '../../../utils/types';
import { type ExperienceResponse } from '../../../services/useExperienceService';
import { createUseStyles } from 'react-jss';
import type { Skill, SkillDropdown } from '../../../services/useSkillService';
import { Chip } from '@mui/material';

const useStyles = createUseStyles((theme: any) => ({
    actionButton: {
        color: theme.palette.background.primary.primary500,
    },
    error: {
        backgroundColor: theme.palette.background.secondary.secondary500,
        color: theme.palette.background.secondary.secondary500
    }
}));

interface IExperienceListTemplateProps {
    experiences: ExperienceResponse[];
    pagination: IPagination;
    handlePaginationChange: any;
    handleRowsPerPageChange: any;
    filters: any;
}

const ExperiencesTableTemplate: React.FC<IExperienceListTemplateProps> = ({ experiences, pagination, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const classes = useStyles();
    const navigate = useNavigate();

    const handleEditClick = (id: number) => {
        const query = {
            page: pagination.currentPage,
            size: pagination.pageSize,
            search: filters.search,
        };
        navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_EDIT, { query: { ...query }, params: { id } }));
    }

    const handleViewClick = (id: number) => {
        const query = {
            page: pagination.currentPage,
            size: pagination.pageSize,
            search: filters.search,
        };
        navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_VIEW, { query: { ...query }, params: { id } }));
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

    const skillSet = (technologiesUsed: SkillDropdown[]) => {
        return <div className={`flex flex-wrap gap-2 ${technologiesUsed.length > 3 ? "flex-wrap" : "flex-col"}`}>
            {technologiesUsed.map((skill: SkillDropdown) => (
                <Chip
                    key={skill.id || skill.logoName}
                    label={skill.logoName}
                    icon={<img src={skill.logoUrl || ""} alt={skill.logoName || ""} className="w-6 h-6" />}
                />
            ))}
        </div>
    }

    const getRecords = () => experiences?.map((experience: ExperienceResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        experience.companyName,
        experience.jobTitle,
        experience.location,
        skillSet(experience.technologiesUsed),
        experience.currentlyWorking ? experience.startDate + " - Present" : experience.startDate + " - " + experience.endDate,
        Action(Number(experience.id))
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { align: "center" } },
        { label: "Company Name", key: "companyName", type: "string" as ColumnType, props: {} },
        { label: "Job Title", key: "jobTitle", type: "string" as ColumnType, props: {} },
        { label: "Location", key: "location", type: "string" as ColumnType, props: {} },
        { label: "Technologies Used", key: "technologiesUsed", type: "string" as ColumnType, props: {} },
        { label: "Duration", key: "duration", type: "string" as ColumnType, props: { align: "center" } },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { align: "center" } },
    ];


    const Action = (id: number) => {
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

export default ExperiencesTableTemplate;
