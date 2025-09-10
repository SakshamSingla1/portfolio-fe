import { useNavigate } from 'react-router-dom';
import { useExperienceService , ExperienceResponse  } from '../../../../services/useExperienceService';
import { HTTP_STATUS } from '../../../../utils/constant';
import ExperienceListTemplate from '../../templates/Experience/ExperienceList.template';
import { useState, useEffect } from 'react';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const ExperienceListingPage: React.FC = () => {
    const experienceService = useExperienceService();
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState<ExperienceResponse[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        currentPage: 0,
        totalRecords: 0,
    });
    const { showSnackbar } = useSnackbar();

    const fetchExperiences = async () => {
        try {
            const response = await experienceService.getAll();

            if (response?.status === HTTP_STATUS.OK && response.data) {
                setExperiences(response.data.data || []);
                setPagination(prev => ({
                    ...prev,
                    totalRecords: response.data.total || 0
                }));
                showSnackbar('success',`${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error',`${error}`);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

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
            <ExperienceListTemplate
                experiences={experiences}
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

export default ExperienceListingPage;