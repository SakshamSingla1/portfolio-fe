import { HTTP_STATUS } from '../../../../utils/constant';
import { useState, useEffect } from 'react';
import { Project, useProjectService } from '../../../../services/useProjectService';
import ProjectListTemplate from '../../templates/Project/ProjectList.template';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const ProjectListingPage: React.FC = () => {
    const projectService = useProjectService();
    const [projects, setProjects] = useState<Project[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        currentPage: 0,
        totalRecords: 0,
    });
    const { showSnackbar } = useSnackbar();

    const fetchProjects = async () => {
        try {
            const response = await projectService.getAll();
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setProjects(response.data.data || []);
                setPagination(prev => ({
                    ...prev,
                    totalRecords: response.data.total || 0
                }));
                showSnackbar('success','Projects fetched successfully');
            }
        } catch (error) {
            showSnackbar('error',`${error}`);
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