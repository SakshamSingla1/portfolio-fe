import React, { useEffect, useState } from 'react';
import { useSocialLinkService, type SocialLink, type SocialLinkResponse } from '../../../services/useSocialLinkService';
import { useNavigate } from 'react-router-dom';
import { HTTP_STATUS } from '../../../utils/types';
import SocialLinkFormTemplate from '../../templates/SocialLinks/SocialLinksForm.template';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { useParams } from 'react-router-dom';
import { makeRoute } from '../../../utils/helper';
import { useSnackbar } from '../../../hooks/useSnackBar';

const SocialLinkEditPage: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();
    const id = String(params.id);
    
    const { showSnackbar } = useSnackbar();

    const socialLinkService = useSocialLinkService();
    
    const [socialLink, setSocialLink] = useState<SocialLinkResponse | null>(null);

    const updateSocialLink = async (values: SocialLink) => {
        try {
            const response = await socialLinkService.update(id, values);
            if (response?.status === HTTP_STATUS.OK) {
                navigate(makeRoute(ADMIN_ROUTES.SOCIAL_LINKS, {}));
                showSnackbar('success', response.data.message);
            }
        } catch (error) {
            console.log(error);
            showSnackbar('error', `${error}`);
        }
    };

    const loadSocialLink = async () => {
        try {
            const response = await socialLinkService.getById(id);
            if (response?.status === HTTP_STATUS.OK) {
                setSocialLink(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadSocialLink();
    }, []);

    return (
        <div>
            <SocialLinkFormTemplate onSubmit={updateSocialLink} mode={MODE.EDIT} socialLink={socialLink} />
        </div>
    );
};

export default SocialLinkEditPage;