import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiTrash } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import TableV1 from '../../organisms/TableV1/TableV1';
import { type ColumnType } from '../../organisms/TableV1/TableV1';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { DateUtils, makeRoute } from '../../../utils/helper';
import { type IPagination } from '../../../utils/types';
import { type ProjectResponse , useProjectService } from '../../../services/useProjectService';
import { createUseStyles } from 'react-jss';
import type { SkillDropdown } from '../../../services/useSkillService';
import { Chip } from '@mui/material';
import DeleteConfirmation from '../../molecules/DeleteConfirmation/DeleteConfirmation';
import { useSnackbar } from '../../../hooks/useSnackBar';

const useStyles = createUseStyles((theme: any) => ({
    actionButton: {
        color: theme.palette.background.primary.primary500,
    },
    error: {
        backgroundColor: theme.palette.background.secondary.secondary500,
        color: theme.palette.background.secondary.secondary500
    }
}));

interface IProjectListTemplateProps {
    projects: ProjectResponse[];
    pagination: IPagination;
    handlePaginationChange: any;
    handleRowsPerPageChange: any;
    filters: any;
}

const ProjectsTableTemplate: React.FC<IProjectListTemplateProps> = ({ projects, pagination, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const projectService = useProjectService();
    const { showSnackbar } = useSnackbar();
    const [showDeletePopup, setShowDeletePopup] = React.useState(false);
    const [projectToDelete, setProjectToDelete] = React.useState<number | null>(null);

    const handleEditClick = (id: number) => {
        const query = {
            page: pagination.currentPage,
            size: pagination.pageSize,
            search: filters.search,
        };
        navigate(makeRoute(ADMIN_ROUTES.PROJECTS_EDIT, { query: { ...query }, params: { id } }));
    }

    const handleViewClick = (id: number) => {
        const query = {
            page: pagination.currentPage,
            size: pagination.pageSize,
            search: filters.search,
        };
        navigate(makeRoute(ADMIN_ROUTES.PROJECTS_VIEW, { query: { ...query }, params: { id } }));
    }

    const handleDeleteClick = async (id: number) => {
        try {
            const response = await projectService.deleteProject(id);
            if (response.status === 200) {
                showSnackbar("success", "Project deleted successfully");
            }
        } catch (error) {
            showSnackbar("error", "Project deleted failed");
        }
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

    const getRecords = () => projects?.map((project: ProjectResponse, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        project.projectName,
        skillSet(project.technologiesUsed),
        project.currentlyWorking ? DateUtils.formatDateTimeToDateMonthYear(project.projectStartDate) + " - Present" : DateUtils.formatDateTimeToDateMonthYear(project.projectStartDate) + " - " + DateUtils.formatDateTimeToDateMonthYear(project.projectEndDate),
        Action(Number(project.id))
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { align: "center" } },
        { label: "Project", key: "projectName", type: "string" as ColumnType, props: {} },
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
                    <button onClick={() => {
                        setProjectToDelete(id);
                        setShowDeletePopup(true);
                    }}><FiTrash className={`ml-2 ${classes.actionButton} text-lg`} /></button>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <TableV1 schema={getSchema()} records={getRecords()} />
            {
                            showDeletePopup && (
                                <DeleteConfirmation
                                    open={showDeletePopup}
                                    title="Delete Skill"
                                    description="Are you sure you want to delete this skill?"
                                    onDelete={() => {
                                        if (projectToDelete !== null) {
                                            handleDeleteClick(projectToDelete);
                                            setShowDeletePopup(false);
                                            setProjectToDelete(null);
                                            window.location.reload();
                                        }
                                    }}
                                    onCancel={() => setShowDeletePopup(false)}
                                />
                            )
                        }
        </div>
    )
}

export default ProjectsTableTemplate;
