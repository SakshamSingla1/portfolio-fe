import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPagination } from '../../../utils/types';
import { makeRoute } from '../../../utils/helper';
import { ADMIN_ROUTES } from '../../../utils/constant';
import TableV1, { ColumnType, TableColumn } from '../../molecules/TableV1/TableV1';
import viewEyeIcon from '../../../assets/icons/viewEyeOutlinedIconPrimary500.svg';
import editIcon from '../../../assets/icons/editPenOutlinedIconPrimary500.svg';
import { Project } from '../../../services/useProjectService';

interface IProjectListTemplateProps {
    projects: Project[];
    pagination: IPagination;
    onPageChange: (event: any, newPage: number) => void;
    onRowsPerPageChange: (event: any) => void;
    onRowClick?: (project: Project) => void;
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
                render: (row: Project) => (
                    <div className="flex justify-center space-x-2">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(makeRoute(ADMIN_ROUTES.PROJECTS_EDIT, { id: row.id }));
                            }} 
                            className="w-6 h-6 cursor-pointer hover:opacity-75 transition-opacity"
                        >
                            <img src={editIcon} alt="Edit" className="w-full h-full" />
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(makeRoute(ADMIN_ROUTES.PROJECTS_VIEW, { id: row.id }));
                            }} 
                            className="w-6 h-6 cursor-pointer hover:opacity-75 transition-opacity"
                        >
                            <img src={viewEyeIcon} alt="View" className="w-full h-full" />
                        </button>
                    </div>
                ),
                props: {
                    align: 'center'
                } 
            }
        ] as TableColumn[]
    };

    const Action = (degree: string) => {
        return (
            <div className='flex justify-center space-x-2'>
                <button onClick={()=>handleEditClick(degree)} className={`w-6 h-6 cursor-pointer`}>
                    <img src={editIcon} alt={editIcon} />
                </button>
                <button onClick={()=>handleViewClick(degree)} className={`w-6 h-6 cursor-pointer`}>
                    <img src={viewEyeIcon} alt={viewEyeIcon} />
                </button>
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
        return projects.map((project: Project, index: number) => {
            return [
                pagination.currentPage + index,
                project.projectName,
                project.projectLink,
                project.technologiesUsed,
                project.projectDuration,
                Action(project.id?.toString() ?? "")
            ];
        });
    }, [projects]);
    
    return (
        <div>
            <div className={`pt-8`}>
                <TableV1 schema={schema} records={records} />
            </div>
        </div>
    );
};

export default ProjectListTemplate;