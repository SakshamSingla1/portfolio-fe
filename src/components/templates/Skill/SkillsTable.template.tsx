import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiTrash } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import TableV1 from '../../organisms/TableV1/TableV1';
import { type ColumnType } from '../../organisms/TableV1/TableV1';
import { ADMIN_ROUTES, SKILL_CATEGORY_OPTIONS } from '../../../utils/constant';
import { makeRoute, OptionToValue } from '../../../utils/helper';
import { type IPagination } from '../../../utils/types';
import { type Skill, useSkillService } from '../../../services/useSkillService';
import { createUseStyles } from 'react-jss';
import { useSnackbar } from '../../../hooks/useSnackBar';
import DeleteConfirmation from '../../molecules/DeleteConfirmation/DeleteConfirmation';

const useStyles = createUseStyles((theme: any) => ({
    actionButton: {
        color: theme.palette.background.primary.primary500,
    },
    error: {
        backgroundColor: theme.palette.background.secondary.secondary500,
        color: theme.palette.background.secondary.secondary500
    }
}));

interface ISkillListTemplateProps {
    skills: Skill[];
    pagination: IPagination;
    handlePaginationChange: any;
    handleRowsPerPageChange: any;
    filters: any;
}

const SkillsTableTemplate: React.FC<ISkillListTemplateProps> = ({ skills, pagination, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const skillService = useSkillService();
    const { showSnackbar } = useSnackbar();
    const [showDeletePopup, setShowDeletePopup] = React.useState(false);
    const [skillToDelete, setSkillToDelete] = React.useState<number | null>(null);

    const handleEditClick = (id: number) => {
        const query = {
            page: pagination.currentPage,
            size: pagination.pageSize,
            search: filters.search,
        };
        navigate(makeRoute(ADMIN_ROUTES.SKILL_EDIT, { query: { ...query }, params: { id: id } }));
    }

    const handleViewClick = (id: number) => {
        const query = {
            page: pagination.currentPage,
            size: pagination.pageSize,
            search: filters.search,
        };
        navigate(makeRoute(ADMIN_ROUTES.SKILL_VIEW, { query: { ...query }, params: { id: id } }));
    }

    const handleDeleteClick = async (id: number) => {
        try {
            const response = await skillService.remove(Number(id));
            if (response.status === 200) {
                showSnackbar("success", "Skill deleted successfully");
                setSkillToDelete(null);
                setShowDeletePopup(false);
                window.location.reload();
            }
        } catch (error) {
            showSnackbar("error", "Skill deleted failed");
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

    const getRecords = () => skills?.map((skill: Skill, index) => [
        pagination.currentPage * pagination.pageSize + index + 1,
        skill.logoName,
        <img src={skill.logoUrl || ""} alt="logo" className="w-10 h-10" />,
        OptionToValue(SKILL_CATEGORY_OPTIONS, skill.category || ""),
        skill.level,
        Action(Number(skill.id))
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { className: '' } },
        { label: "Logo Name", key: "logoName", type: "string" as ColumnType, props: { className: '' } },
        { label: "Logo URL", key: "logoUrl", type: "string" as ColumnType, props: { className: '' } },
        { label: "Category", key: "category", type: "string" as ColumnType, props: { className: '' } },
        { label: "Level", key: "level", type: "string" as ColumnType, props: { className: '' } },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { className: '' } },
    ]

    const Action = (id: number) => {
        if (id) {
            return (
                <div title=''>
                    <button onClick={() => handleViewClick(id)}><div className={`ml-2 ${classes.actionButton} text-lg`}>
                        <FiEye className={`ml-2 ${classes.actionButton} text-lg`} />
                    </div></button>
                    <button onClick={() => handleEditClick(id)}> <LiaEdit className={`ml-2 ${classes.actionButton} text-lg`} /></button>
                    <button onClick={() => {
                        setSkillToDelete(id);
                        setShowDeletePopup(true);
                    }}> <FiTrash className={`ml-2 ${classes.actionButton} text-lg`} /></button>
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
                            if (skillToDelete !== null) {
                                handleDeleteClick(skillToDelete);
                            }
                        }}
                        onCancel={() => setShowDeletePopup(false)}
                    />
                )
            }
        </div>
    )
}

export default SkillsTableTemplate;
