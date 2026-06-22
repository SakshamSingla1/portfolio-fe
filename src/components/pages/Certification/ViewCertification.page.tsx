import { useEffect, useState } from "react";
import { useCertificationService, type Certification } from "../../../services/useCertificationService";
import { MODE } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import CertificationFormTemplate from "../../templates/Certification/CertificationForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const ViewCertificationPage = () => {
    const certificationService = useCertificationService();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [certification, setCertification] = useState<Certification | null>(null);

    const getCertification = async (id: number | null) => {
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
            getCertification(id ? Number(id) : null);
        }
    }, [id]);

    return (
        <div>
            <CertificationFormTemplate
                onSubmit={async () => { }}
                mode={MODE.VIEW}
                certification={certification}
            />
        </div>
    );
};

export default ViewCertificationPage;