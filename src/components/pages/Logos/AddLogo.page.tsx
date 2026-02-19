import { useLogoService, type Logo } from "../../../services/useLogoService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import LogoFormTemplate from "../../templates/Logos/LogoForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const AddLogoPage = () => {
    const logoService = useLogoService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.LOGO);

    const handleSubmit = async (values: Logo) => {
        try {
            const response = await logoService.create(values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                onClose();
                navigate(ADMIN_ROUTES.LOGO);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    return (
        <div>
            <LogoFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.ADD}
            />
        </div>
    )
}
export default AddLogoPage;
