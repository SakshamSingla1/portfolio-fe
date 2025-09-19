import { useEducationService, type Education } from "../../../services/useEducationService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import EducationFormTemplate from "../../templates/Education/EducationForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const AddEducationPage = () => {
    const educationService = useEducationService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.EDUCATION);

    const handleSubmit = async (values: Education) => {
        try {
            const response = await educationService.create(values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                onClose();
                navigate(ADMIN_ROUTES.EDUCATION);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    return (
        <div>
            <EducationFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.ADD}
            />
        </div>
    )
}
export default AddEducationPage;
