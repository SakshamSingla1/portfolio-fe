import { HTTP_STATUS } from '../../../utils/constant';
import { useState, useEffect } from 'react';
import { Skill, useSkillService } from '../../../services/useSkillService';
import SkillListTemplate from '../../templates/Skill/SkillList.template';
import Button from '../../atoms/Button/Button';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { useNavigate } from 'react-router-dom';

const SkillListingPage: React.FC = () => {
    const skillService = useSkillService();
    const navigate = useNavigate();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        currentPage: 0,
        totalRecords: 0,
    });

    const fetchSkills = async () => {
        try {
            const response = await skillService.getAll();
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setSkills(response.data.data || []);
                setPagination(prev => ({
                    ...prev,
                    totalRecords: response.data.total || 0
                }));
            }
        } catch (error) {
            console.error('Error fetching education records:', error);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, [pagination.currentPage, pagination.pageSize]);

    const handlePageChange = (event: unknown, newPage: number) => {
        setPagination(prev => ({
            ...prev,
            currentPage: newPage
        }));
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPagination(prev => ({
            ...prev,
            pageSize: parseInt(event.target.value, 10),
            currentPage: 0
        }));
    };

    const handleAddNew = () => {
        navigate(ADMIN_ROUTES.SKILL_ADD);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Skills</h1>
                <Button
                    label="+ Add New"
                    variant="primaryContained"
                    onClick={handleAddNew}
                    className="px-4 py-2"
                />
            </div>

            <SkillListTemplate
                skills={skills}
                pagination={{
                    currentPage: pagination.currentPage + 1,
                    pageSize: pagination.pageSize,
                    totalRecords: pagination.totalRecords,
                    handleChangePage: handlePageChange,
                    handleChangeRowsPerPage: handleRowsPerPageChange
                }}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </div>
    );
};

export default SkillListingPage;