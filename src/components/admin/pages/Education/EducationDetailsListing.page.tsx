import { useNavigate } from 'react-router-dom';
import { useEducationService } from '../../../../services/useEducationService';
import { HTTP_STATUS, ADMIN_ROUTES } from '../../../../utils/constant';
import Button from '../../../atoms/Button/Button';
import EducationListTemplate from '../../templates/Education/EducationList.template';
import { useState, useEffect } from 'react';
import { Education } from '../../../../services/useEducationService';

const EducationDetailsListingPage: React.FC = () => {
    const educationService = useEducationService();
    const navigate = useNavigate();
    const [educations, setEducations] = useState<Education[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        currentPage: 0,
        totalRecords: 0,
    });

    const fetchEducations = async () => {
        try {
            const response = await educationService.getAll();

            if (response?.status === HTTP_STATUS.OK && response.data) {
                setEducations(response.data.data || []);
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
        fetchEducations();
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

    return (
        <div className="p-6">
            <EducationListTemplate
                educations={educations}
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

export default EducationDetailsListingPage;