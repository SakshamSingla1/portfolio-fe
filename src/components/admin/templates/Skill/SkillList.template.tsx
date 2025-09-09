    import React, { useMemo } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { IPagination } from '../../../../utils/types';
    import { makeRoute } from '../../../../utils/helper';
    import { ADMIN_ROUTES } from '../../../../utils/constant';
    import TableV1, { ColumnType, TableColumn } from '../../../molecules/TableV1/TableV1';
    import viewEyeIcon from '../../../../assets/icons/viewEyeOutlinedIconPrimary500.svg';
    import editIcon from '../../../../assets/icons/editPenOutlinedIconPrimary500.svg';
    import { Skill, SkillResponse } from '../../../../services/useSkillService';
import SkillGlobe from './SkillGlobe';

    interface ISkillListTemplateProps {
        skills: SkillResponse[];
        pagination: IPagination;
        onPageChange: (event: any, newPage: number) => void;
        onRowsPerPageChange: (event: any) => void;
        onRowClick?: (skill: Skill) => void;
    }

    const SkillListTemplate: React.FC<ISkillListTemplateProps> = ({ 
        skills, 
        pagination, 
        onPageChange, 
        onRowsPerPageChange,
        onRowClick 
    }) => {
        const navigate = useNavigate();

        const schema = {
            id: 'skill-list',
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
                    label: "Skill Name", 
                    key: "skillName", 
                    type: "string" as ColumnType, 
                    props: {} 
                },
                {
                    label: "Skill Logo", 
                    key: "skillLogo", 
                    type: "custom" as ColumnType,
                },
                { 
                    label: "Skill Level", 
                    key: "skillLevel", 
                    type: "string" as ColumnType, 
                    props: {} 
                },
                { 
                    label: "Skill Category", 
                    key: "skillCategory", 
                    type: "string" as ColumnType,
                    props: {} 
                },
                { 
                    label: "Actions", 
                    key: "actions", 
                    type: "custom" as ColumnType,
                    render: (row: Skill) => (
                        <div className="flex justify-center space-x-2">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(makeRoute(ADMIN_ROUTES.SKILL_EDIT, { id: row.id }));
                                }} 
                                className="w-6 h-6 cursor-pointer hover:opacity-75 transition-opacity"
                            >
                                <img src={editIcon} alt="Edit" className="w-full h-full" />
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(makeRoute(ADMIN_ROUTES.SKILL_VIEW, { id: row.id }));
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
            navigate(makeRoute(ADMIN_ROUTES.SKILL_EDIT, { id }));
        };

        const handleViewClick = (id: string) => {
            navigate(makeRoute(ADMIN_ROUTES.SKILL_VIEW, { id }));
        };

        const records = useMemo(() => {
            return skills.map((skill: SkillResponse, index: number) => {
                return [
                    pagination.currentPage + index,
                    skill.logoName,
                    <div className='flex items-center justify-center space-x-2'>
                        <img src={skill.logoUrl || ''} alt={skill.logoName || ''} className="w-10 h-10" />
                    </div>,
                    skill.level,
                    skill.category,
                    Action(skill.id?.toString() ?? "")
                ];
            });
        }, [skills]);
        
        return (
            <div>
                <div className={`pt-8`}>
                    <TableV1 schema={schema} records={records} />
                </div>
                <SkillGlobe logoUrls={skills.map(skill => skill.logoUrl || '')} />
            </div>
        );
    };

    export default SkillListTemplate;