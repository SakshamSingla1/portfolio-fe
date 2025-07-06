import { HTTP_STATUS } from '../../../utils/constant';
import { useState, useEffect } from 'react';
import { Project, useProjectService } from '../../../services/useProjectService';
import ProjectListTemplate from '../../templates/Project/ProjectList.template';
import Button from '../../atoms/Button/Button';
import { ADMIN_ROUTES } from '../../../utils/constant';
import { useNavigate } from 'react-router-dom';

const ProjectListingPage: React.FC = () => {
    const projectService = useProjectService();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        currentPage: 0,
        totalRecords: 0,
    });

    const fetchProjects = async () => {
        try {
            const response = await projectService.getAll();
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setProjects(response.data.data || []);
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
        fetchProjects();
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
            <ProjectListTemplate
                projects={projects}
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

export default ProjectListingPage;