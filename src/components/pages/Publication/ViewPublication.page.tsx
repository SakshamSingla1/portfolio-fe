import { useEffect, useState } from "react";
import { usePublicationService, type Publication } from "../../../services/usePublicationService";
import { MODE } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import PublicationFormTemplate from "../../templates/Publication/PublicationForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const ViewPublicationPage = () => {
    const publicationService = usePublicationService();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [publication, setPublication] = useState<Publication | null>(null);

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

    useEffect(() => {
        if (id) {
            getPublication(id ? Number(id) : null);
        }
    }, [id]);

    return (
        <div>
            <PublicationFormTemplate
                onSubmit={async () => { }}
                mode={MODE.VIEW}
                publication={publication}
            />
        </div>
    );
};

export default ViewPublicationPage;
