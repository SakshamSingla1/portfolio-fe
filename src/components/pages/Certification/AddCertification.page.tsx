import { useCertificationService, type CertificationRequest } from "../../../services/useCertificationService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import CertificationFormTemplate from "../../templates/Certification/CertificationForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";

const AddCertificationPage = () => {
    const certificationService = useCertificationService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const { user } = useAuthenticatedUser();

    const onClose = () => navigate(ADMIN_ROUTES.CERTIFICATIONS);

    const handleSubmit = async (values: CertificationRequest) => {
        try {
            const response = await certificationService.create({
                ...values,
                profileId: user?.id?.toString() || "",
            });
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                onClose();
                navigate(ADMIN_ROUTES.CERTIFICATIONS);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    return (
        <div>
            <CertificationFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.ADD}
            />
        </div>
    )
}
export default AddCertificationPage;
