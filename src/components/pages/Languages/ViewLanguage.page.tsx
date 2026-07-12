import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguageService, type Language } from "../../../services/useLanguageService";
import { HTTP_STATUS } from "../../../utils/types";
import { MODE } from "../../../utils/constant";
import LanguageFormTemplate from "../../templates/Languages/LanguageForm.template";

const ViewLanguagePage = () => {
    const { id } = useParams();
    const languageService = useLanguageService();
    const [language, setLanguage] = useState<Language | null>(null);

    useEffect(() => {
        if (!id) return;
        languageService.getById(Number(id)).then((res) => {
            if (res?.status === HTTP_STATUS.OK) setLanguage(res.data.data);
        });
    }, [id]);

    return <LanguageFormTemplate onSubmit={async () => {}} mode={MODE.VIEW} language={language} />;
};

export default ViewLanguagePage;
