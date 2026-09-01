import { useEffect, useState } from "react";
import { usePublicationService, type Publication, type PublicationRequest } from "../../../services/usePublicationService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import PublicationFormTemplate from "../../templates/Publication/PublicationForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const EditPublicationPage = () => {
    const publicationService = usePublicationService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [publication, setPublication] = useState<Publication | null>(null);

    const handleSubmit = async (values: PublicationRequest) => {
        try {
            if (!id) return;
            const response = await publicationService.update(id ? Number(id) : null, values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                navigate(ADMIN_ROUTES.PUBLICATIONS);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    useEffect(() => {
        const getPublication = async (id: number | null) => {
            try {
                const response = await publicationService.getById(id);
                if (response?.status === HTTP_STATUS.OK && response.data) {
                    setPublication(response.data.data);
                }
            } catch (error) {
                showSnackbar('error', `${error}`);
            }
        };
        if (id) {
            getPublication(id ? Number(id) : null);
        }
    }, [id, publicationService, showSnackbar]);

    return (
        <div>
            <PublicationFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.EDIT}
                publication={publication}
            />
        </div>
    );
};

export default EditPublicationPage;
