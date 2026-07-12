import { useNavigate } from "react-router-dom";
import { useLanguageService, type LanguageRequest } from "../../../services/useLanguageService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import LanguageFormTemplate from "../../templates/Languages/LanguageForm.template";

const AddLanguagePage = () => {
    const languageService = useLanguageService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const handleSubmit = async (values: LanguageRequest) => {
        try {
            const response = await languageService.create(values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar("success", response?.data?.message);
                navigate(ADMIN_ROUTES.LANGUAGES);
            } else {
                showSnackbar("error", response?.data?.message);
            }
        } catch (error) {
            showSnackbar("error", String(error));
        }
    };

    return <LanguageFormTemplate onSubmit={handleSubmit} mode={MODE.ADD} />;
};

export default AddLanguagePage;
