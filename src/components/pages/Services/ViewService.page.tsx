import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useServiceService, type ServiceOffering } from "../../../services/useServiceService";
import { HTTP_STATUS } from "../../../utils/types";
import { MODE } from "../../../utils/constant";
import ServiceFormTemplate from "../../templates/Services/ServiceForm.template";

const ViewServicePage = () => {
    const { id } = useParams();
    const serviceService = useServiceService();
    const [service, setService] = useState<ServiceOffering | null>(null);

    useEffect(() => {
        if (!id) return;
        serviceService.getById(Number(id)).then((res) => {
            if (res?.status === HTTP_STATUS.OK) setService(res.data.data);
        });
    }, [id]);

    return <ServiceFormTemplate onSubmit={async () => {}} mode={MODE.VIEW} service={service} />;
};

export default ViewServicePage;
