import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceService, type ServiceOffering, type ServiceRequest } from "../../../services/useServiceService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import ServiceFormTemplate from "../../templates/Services/ServiceForm.template";

const EditServicePage = () => {
    const { id } = useParams();
    const serviceService = useServiceService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [service, setService] = useState<ServiceOffering | null>(null);

    useEffect(() => {
        if (!id) return;
        serviceService.getById(Number(id)).then((res) => {
            if (res?.status === HTTP_STATUS.OK) setService(res.data.data);
        });
    }, [id, serviceService]);

    const handleSubmit = async (values: ServiceRequest) => {
        try {
            const res = await serviceService.update(id ? Number(id) : null, values);
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

    return <ServiceFormTemplate onSubmit={handleSubmit} mode={MODE.EDIT} service={service} />;
};

export default EditServicePage;
