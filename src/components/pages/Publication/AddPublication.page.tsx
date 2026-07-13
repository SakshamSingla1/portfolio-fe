import { usePublicationService, type PublicationRequest } from "../../../services/usePublicationService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import PublicationFormTemplate from "../../templates/Publication/PublicationForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const AddPublicationPage = () => {
    const publicationService = usePublicationService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.PUBLICATIONS);

    const handleSubmit = async (values: PublicationRequest) => {
        try {
            const response = await publicationService.create({ ...values });
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                onClose();
                navigate(ADMIN_ROUTES.PUBLICATIONS);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    return (
        <div>
            <PublicationFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.ADD}
            />
        </div>
    )
}

export default AddPublicationPage;
