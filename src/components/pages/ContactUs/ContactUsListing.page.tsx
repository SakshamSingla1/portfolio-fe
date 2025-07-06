import { HTTP_STATUS, ADMIN_ROUTES } from '../../../utils/constant';
import { useState, useEffect } from 'react';
import { Education } from '../../../services/useEducationService';
import { ContactUs, useContactUsService } from '../../../services/useContactUsService';
import ContactUsListTemplate from '../../templates/ContactUs/ContactUsList.template';

const ContactUsListingPage: React.FC = () => {
    const contactUsService = useContactUsService();
    const [contactUss, setContactUss] = useState<ContactUs[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        currentPage: 0,
        totalRecords: 0,
    });

    const fetchContactUs = async () => {
        try {
            const response = await contactUsService.getAll();

            if (response?.status === HTTP_STATUS.OK && response.data) {
                setContactUss(response.data.data || []);
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
        fetchContactUs();
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Contact Us</h1>
            </div>

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