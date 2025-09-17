import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPagination } from '../../../../utils/types';
import { makeRoute, OptionToValue } from '../../../../utils/helper';
import { ADMIN_ROUTES, DEGREE_OPTIONS } from '../../../../utils/constant';
import TableV1, { ColumnType, TableColumn, TableSchema } from '../../../molecules/TableV1/TableV1';
import viewEyeIcon from '../../../../assets/icons/viewEyeOutlinedIconPrimary500.svg';
import editIcon from '../../../../assets/icons/editPenOutlinedIconPrimary500.svg';
import { Education } from '../../../../services/useEducationService';
import EducationCard from '../../../atoms/EducationCard/EducationCard';
import EducationTimeline from '../../../molecules/EducationTimeline/EducationTimeline';

interface IEducationListTemplateProps {
    educations: Education[];
    pagination: IPagination;
    onPageChange: (event: any, newPage: number) => void;
    onRowsPerPageChange: (event: any) => void;
    onRowClick?: (education: Education) => void;
}

const EducationListTemplate: React.FC<IEducationListTemplateProps> = ({ 
    educations, 
    pagination, 
    onPageChange, 
    onRowsPerPageChange,
    onRowClick 
}) => {
    const navigate = useNavigate();

    const schema : TableSchema = {
        id: 'education-list',
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
                label: "Institution", 
                key: "institution", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Degree", 
                key: "degree", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Field of Study", 
                key: "fieldOfStudy", 
                type: "string" as ColumnType, 
                props: {} 
            },
            { 
                label: "Duration", 
                key: "duration", 
                type: "custom" as ColumnType,
                render: (row: Education) => (
                    <span>
                        {row.endYear} - {row.startYear}
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
                render: (row: Education) => (
                    <div className="flex justify-center space-x-2">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(makeRoute(ADMIN_ROUTES.EDUCATION_EDIT, { degree: row.degree }));
                            }} 
                            className="w-6 h-6 cursor-pointer hover:opacity-75 transition-opacity"
                        >
                            <img src={editIcon} alt="Edit" className="w-full h-full" />
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(makeRoute(ADMIN_ROUTES.EDUCATION_VIEW, { degree: row.degree }));
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

    const handleEditClick = (degree: string) => {
        navigate(makeRoute(ADMIN_ROUTES.EDUCATION_EDIT, { degree }));
    };

    const handleViewClick = (degree: string) => {
        navigate(makeRoute(ADMIN_ROUTES.EDUCATION_VIEW, { degree }));
    };

    const records = useMemo(() => {
        return educations.map((education: Education, index: number) => {
            return [
                pagination.currentPage + index,
                education.institution,
                OptionToValue(DEGREE_OPTIONS, education.degree),
                education.fieldOfStudy,
                `${education.startYear} - ${education.endYear}`,
                education.location,
                Action(education.degree)
            ];
        });
    }, [educations]);
    
    return (
        <div>
            <div className={`pt-8`}>
                <TableV1 schema={schema} records={records} />
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
                <EducationTimeline educations={educations} />
            </div>
        </div>
    );
};

export default EducationListTemplate;