import { useSocialLinkService, type SocialLink } from "../../../services/useSocialLinkService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import SocialLinksFormTemplate from "../../templates/SocialLinks/SocialLinksForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const AddSocialLinkPage = () => {
    const socialLinkService = useSocialLinkService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.SOCIAL_LINKS);

    const handleSubmit = async (values: SocialLink) => {
        try {
            const response = await socialLinkService.create(values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                onClose();
                navigate(ADMIN_ROUTES.SOCIAL_LINKS);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    return (
        <div>
            <SocialLinksFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.ADD}
            />
        </div>
    )
}
export default AddSocialLinkPage;
