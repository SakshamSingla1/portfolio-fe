import { HTTP_STATUS } from '../../../../utils/constant';
import { useState, useEffect } from 'react';
import { Skill, SkillResponse, useSkillService } from '../../../../services/useSkillService';
import SkillListTemplate from '../../templates/Skill/SkillList.template';
import { useNavigate } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const useStyles = createUseStyles((theme:any)=>{
    return {
        title: {
            color: theme.palette.background.primary.primary50,
        }
    }
})

const SkillListingPage: React.FC = () => {
    const classes = useStyles();
    const skillService = useSkillService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [skills, setSkills] = useState<SkillResponse[]>([]);
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
                showSnackbar('success',`${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error',`${error}`);
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

    return (
        <div className="p-6">

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