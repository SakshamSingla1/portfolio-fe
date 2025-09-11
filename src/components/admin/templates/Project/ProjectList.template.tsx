import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPagination } from '../../../../utils/types';
import { makeRoute } from '../../../../utils/helper';
import { ADMIN_ROUTES } from '../../../../utils/constant';
import TableV1, { ColumnType, TableColumn } from '../../../molecules/TableV1/TableV1';
import viewEyeIcon from '../../../../assets/icons/viewEyeOutlinedIconPrimary500.svg';
import editIcon from '../../../../assets/icons/editPenOutlinedIconPrimary500.svg';
import { Project, ProjectResponse } from '../../../../services/useProjectService';
import { SkillDropdown } from '../../../../services/useSkillService';
import ProjectTimeline from '../../../molecules/ProjectTimeline/ProjectTimeline';

interface IProjectListTemplateProps {
    projects: ProjectResponse[];
    pagination: IPagination;
    onPageChange: (event: any, newPage: number) => void;
    onRowsPerPageChange: (event: any) => void;
    onRowClick?: (project: ProjectResponse) => void;
}

const ProjectListTemplate: React.FC<IProjectListTemplateProps> = ({ 
    projects, 
    pagination, 
    onPageChange, 
    onRowsPerPageChange,
    onRowClick 
}) => {
    const navigate = useNavigate();

    const schema = {
        id: 'project-list',
        pagination: {
            total: pagination.totalRecords,
            currentPage: pagination.currentPage,
            isVisible: true,
            limit: pagination.pageSize,
            handleChangePage: onPageChange,
            handleChangeRowsPerPage: onRowsPerPageChange
        },
        columns: [
            { 
                label: "Sr No.", 
                key: "index", 
                type: "number" as ColumnType, 
                props: { 
                    style: { width: '80px' } 
                } 
            },
            { 
                label: "Project Name", 
                key: "projectName", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Project Link", 
                key: "projectLink", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Tech Stack", 
                key: "techStack", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Project Duration", 
                key: "projectDuration", 
                type: "string" as ColumnType,
                props: {} 
            },
            { 
                label: "Actions", 
                key: "actions", 
                type: "custom" as ColumnType,
                props: {}
            }
        ] as TableColumn[]
    };

    const Action = (id: string) => {
        return (
            <div className='flex justify-center space-x-2' title=''>
                <button onClick={()=>handleEditClick(id)} className={`w-6 h-6 cursor-pointer`}>
                    <img src={editIcon} alt={editIcon} />
                </button>
                <button onClick={()=>handleViewClick(id)} className={`w-6 h-6 cursor-pointer`}>
                    <img src={viewEyeIcon} alt={viewEyeIcon} />
                </button>
            </div>
        );
    };

    const techStack = (techStack: SkillDropdown[]) => {
        return (
            <div className='flex flex-col items-center justify-center gap-y-4' title={techStack.map((tech: SkillDropdown) => tech.logoName).join(", ")}> 
                {techStack.map((tech: SkillDropdown) => 
                    <div key={tech.id} className='flex items-center space-x-2'>
                        <img src={tech.logoUrl} alt={tech.logoName} className='w-6 h-6' />
                        <span>{tech.logoName}</span>
                    </div>
                )}
            </div>
        );
    };

    const handleEditClick = (id: string) => {
        navigate(makeRoute(ADMIN_ROUTES.PROJECTS_EDIT, { id }));
    };

    const handleViewClick = (id: string) => {
        navigate(makeRoute(ADMIN_ROUTES.PROJECTS_VIEW, { id }));
    };

    const records = useMemo(() => {
        return projects.map((project: ProjectResponse, index: number) => {
            return [
                pagination.currentPage + index,
                project.projectName,
                project.projectLink,
                techStack(project.technologiesUsed),
                project.currentlyWorking ? "Present" : project.projectStartDate + " - " + project.projectEndDate,
                Action(project.id?.toString() ?? "")
            ];
        });
    }, [projects]);
    
    return (
        <div>
            <div className={`pt-8`}>
                <TableV1 schema={schema} records={records} />
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
                <ProjectTimeline projects={projects} />
            </div>
        </div>
    );
};

export default ProjectListTemplate;