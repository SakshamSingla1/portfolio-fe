import { useNavigate } from 'react-router-dom';
import { useEducationService } from '../../../../services/useEducationService';
import { HTTP_STATUS, ADMIN_ROUTES } from '../../../../utils/constant';
import Button from '../../../atoms/Button/Button';
import EducationListTemplate from '../../templates/Education/EducationList.template';
import { useState, useEffect } from 'react';
import { Education } from '../../../../services/useEducationService';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const EducationDetailsListingPage: React.FC = () => {
    const educationService = useEducationService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [educations, setEducations] = useState<Education[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        currentPage: 0,
        totalRecords: 0,
        totalPages: 0,
    });

    const fetchEducations = async () => {
        try {
            const response = await educationService.getAllByProfile({});

            if (response?.status === HTTP_STATUS.OK && response.data) {
                setEducations(response.data.data.content || []);
                setPagination(prev => ({
                    ...prev,
                    totalRecords: response.data.data.totalElements || 0,
                    totalPages: response.data.data.totalPages || 0
                }));
                showSnackbar('success',`${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error',`${error}`);
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
                    totalPages: pagination.totalPages,
                }}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </div>
    );
};

export default EducationDetailsListingPage;