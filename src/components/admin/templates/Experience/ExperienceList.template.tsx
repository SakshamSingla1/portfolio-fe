import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPagination } from '../../../../utils/types';
import { makeRoute } from '../../../../utils/helper';
import { ADMIN_ROUTES } from '../../../../utils/constant';
import TableV1, { ColumnType, TableColumn } from '../../../molecules/TableV1/TableV1';
import viewEyeIcon from '../../../../assets/icons/viewEyeOutlinedIconPrimary500.svg';
import editIcon from '../../../../assets/icons/editPenOutlinedIconPrimary500.svg';
import { ExperienceResponse } from '../../../../services/useExperienceService';
import { SkillDropdown } from '../../../../services/useSkillService';
import ExperienceTimeline from '../../../molecules/ExperienceTimeline/ExperienceTimeline';

interface IExperienceListTemplateProps {
    experiences: ExperienceResponse[];
    pagination: IPagination;
    onPageChange: (event: any, newPage: number) => void;
    onRowsPerPageChange: (event: any) => void;
    onRowClick?: (experience: ExperienceResponse) => void;
}

const ExperienceListTemplate: React.FC<IExperienceListTemplateProps> = ({ 
    experiences, 
    pagination, 
    onPageChange, 
    onRowsPerPageChange,
    onRowClick 
}) => {
    const navigate = useNavigate();

    const schema = {
        id: 'experience-list',
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
                label: "Company Name", 
                key: "companyName", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Job Title", 
                key: "jobTitle", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Technologies Used", 
                key: "technologiesUsed", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Duration", 
                key: "duration", 
                type: "custom" as ColumnType,
                render: (row: ExperienceResponse) => (
                    <span>
                        {row.endDate} - {row.startDate}
                    </span>
                ),
                props: {} 
            },
            { 
                label: "Location", 
                key: "location", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Actions", 
                key: "actions", 
                type: "custom" as ColumnType,
                render: (row: ExperienceResponse) => (
                    <div className="flex justify-center space-x-2">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_EDIT, { jobTitle: row.jobTitle }));
                            }} 
                            className="w-6 h-6 cursor-pointer hover:opacity-75 transition-opacity"
                        >
                            <img src={editIcon} alt="Edit" className="w-full h-full" />
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_VIEW, { jobTitle: row.jobTitle }));
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
        navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_EDIT, { id }));
    };

    const handleViewClick = (id: string) => {
        navigate(makeRoute(ADMIN_ROUTES.EXPERIENCE_VIEW, { id }));
    };

    const records = useMemo(() => {
        return experiences.map((experience: ExperienceResponse, index: number) => {
            return [
                pagination.currentPage + index,
                experience.companyName,
                experience.jobTitle,
                techStack(experience.technologiesUsed),
                experience.currentlyWorking ? `${experience.startDate} - Present` : `${experience.startDate} - ${experience.endDate}`,
                experience.location,
                Action(experience.id?.toString() || "")
            ];
        });
    }, [experiences]);
    
    return (
        <div>
            <div className={`pt-8`}>
                <TableV1 schema={schema} records={records} />
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
                <ExperienceTimeline experiences={experiences} />
            </div>
        </div>
    );
};

export default ExperienceListTemplate;