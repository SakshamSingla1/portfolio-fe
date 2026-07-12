import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguageService, type Language, type LanguageRequest } from "../../../services/useLanguageService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import LanguageFormTemplate from "../../templates/Languages/LanguageForm.template";

const EditLanguagePage = () => {
    const { id } = useParams();
    const languageService = useLanguageService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [language, setLanguage] = useState<Language | null>(null);

    useEffect(() => {
        if (!id) return;
        languageService.getById(Number(id)).then((res) => {
            if (res?.status === HTTP_STATUS.OK) setLanguage(res.data.data);
        });
    }, [id]);

    const handleSubmit = async (values: LanguageRequest) => {
        try {
            const response = await languageService.update(id ? Number(id) : null, values);
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

    return <LanguageFormTemplate onSubmit={handleSubmit} mode={MODE.EDIT} language={language} />;
};

export default EditLanguagePage;
