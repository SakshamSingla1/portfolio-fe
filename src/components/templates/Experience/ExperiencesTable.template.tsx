import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiTrash } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import TableV1 from '../../organisms/TableV1/TableV1';
import { type ColumnType } from '../../organisms/TableV1/TableV1';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { DateUtils, makeRoute } from '../../../utils/helper';
import { type IPagination } from '../../../utils/types';
import { type ExperienceResponse, useExperienceService } from '../../../services/useExperienceService';
import type { SkillDropdown } from '../../../services/useSkillService';
import { Chip } from '@mui/material';
import { useSnackbar } from '../../../hooks/useSnackBar';
import DeleteConfirmation from '../../molecules/DeleteConfirmation/DeleteConfirmation';
import { EmploymentStatus } from '../../../services/useExperienceService';

interface IExperienceListTemplateProps {
    experiences: ExperienceResponse[];
    pagination: IPagination;
    handlePaginationChange: any;
    handleRowsPerPageChange: any;
    filters: any;
}

const ExperiencesTableTemplate: React.FC<IExperienceListTemplateProps> = ({ experiences, pagination, handlePaginationChange, handleRowsPerPageChange, filters }) => {
    const navigate = useNavigate();
    const experienceService = useExperienceService();
    const { showSnackbar } = useSnackbar();
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
    const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);

    const handleEditClick = (id: string) => {
        const query = {
            page: pagination.currentPage,
            size: pagination.pageSize,
            search: filters.search,
        };
        navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_EDIT, { query: { ...query }, params: { id } }));
        console.log(id);
    }

    const handleViewClick = (id: string) => {
        const query = {
            page: pagination.currentPage,
            size: pagination.pageSize,
            search: filters.search,
        };
        navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_VIEW, { query: { ...query }, params: { id } }));
        console.log(id);
    }

    const handleDeleteClick = async (id: string) => {
        try {
            const response = await experienceService.remove(id);
            if (response.status === 200) {
                showSnackbar("success", "Experience deleted successfully");
                setExperienceToDelete(null);
                setShowDeletePopup(false);
                window.location.reload();
            }
        } catch (error) {
            showSnackbar("error", "Experience deleted failed");
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

    const skillSet = (skills: SkillDropdown[]) => {
        return <div className={`flex flex-wrap gap-2 ${skills.length > 3 ? "flex-wrap" : "flex-col"}`}>
            {skills.map((skill: SkillDropdown) => (
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
        skillSet(experience.skills),
        experience.employmentStatus === EmploymentStatus.CURRENT ? DateUtils.formatDateTimeToDateMonthYear(experience.startDate) + " - Present" : DateUtils.formatDateTimeToDateMonthYear(experience.startDate) + " - " + DateUtils.formatDateTimeToDateMonthYear(experience.endDate || ""),
        Action(String(experience.id))
    ])

    const getTableColumns = () => [
        { label: "Sr No.", key: "id", type: "number" as ColumnType, props: { align: "center" } },
        { label: "Company Name", key: "companyName", type: "string" as ColumnType, props: {} },
        { label: "Job Title", key: "jobTitle", type: "string" as ColumnType, props: {} },
        { label: "Location", key: "location", type: "string" as ColumnType, props: {} },
        { label: "Skills", key: "skills", type: "custom" as ColumnType, props: {} },
        { label: "Duration", key: "duration", type: "string" as ColumnType, props: { align: "center" } },
        { label: "Action", key: "action", type: "custom" as ColumnType, props: { align: "center" } },
    ];


    const Action = (id: string) => {
        if (id) {
            return (
                <div title=''>
                    <button onClick={() => handleViewClick(String(id))}><div className={`ml-2 text-lg`}>
                        <FiEye className={`ml-2 text-lg`} />
                    </div></button>
                    <button onClick={() => handleEditClick(String(id))}> <LiaEdit className={`ml-2 text-lg`} /></button>
                    <button onClick={() => {
                        setExperienceToDelete(String(id));
                        setShowDeletePopup(true);
                    }}> <FiTrash className={`ml-2 text-lg`} /></button>
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
                        title="Delete Experience"
                        description="Are you sure you want to delete this experience?"
                        onDelete={() => {
                            if (experienceToDelete !== null) {
                                handleDeleteClick(experienceToDelete);
                            }
                        }}
                        onCancel={() => setShowDeletePopup(false)}
                    />
                )
            }
        </div>
    )
}

export default ExperiencesTableTemplate;
