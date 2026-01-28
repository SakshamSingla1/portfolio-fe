import { useEffect, useState } from "react";
import { useCertificationService, type Certification, type CertificationRequest } from "../../../services/useCertificationService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import CertificationFormTemplate from "../../templates/Certification/CertificationForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const EditCertificationPage = () => {
    const certificationService = useCertificationService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [certification, setCertification] = useState<Certification | null>(null);

    const handleSubmit = async (values: CertificationRequest) => {
        try {
            if (!id) return;
            const response = await certificationService.update(String(id), values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                navigate(ADMIN_ROUTES.CERTIFICATIONS);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    const getCertification = async (id: string | null) => {
        try {
            const response = await certificationService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setCertification(response.data.data);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    };

    useEffect(() => {
        if (id) {
            getCertification(String(id));
        }
    }, [id]);

    return (
        <div>
            <CertificationFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.EDIT}
                certification={certification}
            />
        </div>
    );
};

export default EditCertificationPage;