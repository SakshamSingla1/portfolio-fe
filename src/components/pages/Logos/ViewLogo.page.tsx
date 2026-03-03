import { useEffect, useState } from "react";
import { useLogoService, type Logo } from "../../../services/useLogoService";
import { MODE } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import LogoFormTemplate from "../../templates/Logos/LogoForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const ViewLogoPage = () => {
    const logoService = useLogoService();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [logo, setLogo] = useState<Logo | null>(null);

    const getLogo = async (id: string | null) => {
        try {
            const response = await logoService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setLogo(response.data.data);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    };

    useEffect(() => {
        if (id) {
            getLogo(String(id));
        }
    }, [id]);

    return (
        <div>
            <LogoFormTemplate
                onSubmit={() => { }}
                mode={MODE.VIEW}
                logo={logo}
            />
        </div>
    );
};

export default ViewLogoPage;