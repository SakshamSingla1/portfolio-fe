import { HTTP_STATUS } from '../../../../utils/constant';
import { useState, useEffect } from 'react';
import { ContactUs, useContactUsService } from '../../../../services/useContactUsService';
import ContactUsListTemplate from '../../templates/ContactUs/ContactUsList.template';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const ContactUsListingPage: React.FC = () => {
    const contactUsService = useContactUsService();
    const [contactUss, setContactUss] = useState<ContactUs[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        currentPage: 0,
        totalRecords: 0,
    });
    const { showSnackbar } = useSnackbar();

    const fetchContactUs = async () => {
        try {
            const response = await contactUsService.getAll();

            if (response?.status === HTTP_STATUS.OK && response.data) {
                showSnackbar('success', `${response?.data?.message}`);
                setContactUss(response.data.data || []);
                setPagination(prev => ({
                    ...prev,
                    totalRecords: response.data.total || 0
                }));
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    };

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

    useEffect(() => {
        fetchContactUs();
    }, [pagination.currentPage, pagination.pageSize]);

    return (
        <div className="p-6">
            <ContactUsListTemplate
                contactUs={contactUss}
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

export default ContactUsListingPage;