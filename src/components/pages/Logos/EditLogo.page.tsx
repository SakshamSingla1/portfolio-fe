import { useEffect, useState } from "react";
import { useLogoService, type Logo } from "../../../services/useLogoService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import LogoFormTemplate from "../../templates/Logos/LogoForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const EditLogoPage = () => {
    const logoService = useLogoService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [logo, setLogo] = useState<Logo | null>(null);

    const handleSubmit = async (values: Logo) => {
        try {
            if (!id) return;
            const response = await logoService.update(String(id), values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                navigate(ADMIN_ROUTES.LOGO);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

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
                onSubmit={handleSubmit}
                mode={MODE.EDIT}
                logo={logo}
            />
        </div>
    );
};

export default EditLogoPage;