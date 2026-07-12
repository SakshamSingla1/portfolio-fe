import { useNavigate } from "react-router-dom";
import { useServiceService, type ServiceRequest } from "../../../services/useServiceService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import ServiceFormTemplate from "../../templates/Services/ServiceForm.template";

const AddServicePage = () => {
    const serviceService = useServiceService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const handleSubmit = async (values: ServiceRequest) => {
        try {
            const res = await serviceService.create(values);
            if (res?.status === HTTP_STATUS.OK) {
                showSnackbar("success", res?.data?.message);
                navigate(ADMIN_ROUTES.SERVICES);
            } else {
                showSnackbar("error", res?.data?.message);
            }
        } catch (error) {
            showSnackbar("error", String(error));
        }
    };

    return <ServiceFormTemplate onSubmit={handleSubmit} mode={MODE.ADD} />;
};

export default AddServicePage;
