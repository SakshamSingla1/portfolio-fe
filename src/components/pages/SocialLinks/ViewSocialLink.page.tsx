import { useEffect, useState } from "react";
import { useSocialLinkService, type SocialLinkResponse } from "../../../services/useSocialLinkService";
import { MODE } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import SocialLinkFormTemplate from "../../templates/SocialLinks/SocialLinksForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const ViewSocialLinkPage = () => {
    const socialLinkService = useSocialLinkService();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [socialLink, setSocialLink] = useState<SocialLinkResponse | null>(null);

    const getSocialLink = async (id: string | null) => {
        try {
            const response = await socialLinkService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setSocialLink(response.data.data);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    };

    useEffect(() => {
        if (id) {
            getSocialLink(String(id));
        }
    }, [id]);

    return (
        <div>
            <SocialLinkFormTemplate
                onSubmit={() => { }}
                mode={MODE.VIEW}
                socialLink={socialLink}
            />
        </div>
    );
};

export default ViewSocialLinkPage;