import React, { useEffect, useState } from 'react';
import { useNavlinkService, type NavlinkResponse } from '../../../services/useNavlinkService';
import { useNavigate } from 'react-router-dom';
import { HTTP_STATUS } from '../../../utils/types';
import NavlinkFormTemplate from '../../templates/Navlinks/NavlinkForm.template';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { type NavlinkRequest } from '../../../services/useNavlinkService';
import { useParams } from 'react-router-dom';
import { makeRoute } from '../../../utils/helper';
import { useSnackbar } from '../../../hooks/useSnackBar';

const NavlinkEditPage: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();
    const id = String(params.id);
    const { showSnackbar } = useSnackbar();

    const navlinkService = useNavlinkService();

    const [navlink, setNavlink] = useState<NavlinkResponse | null>(null);

    const updateNavlink = async (values: NavlinkRequest) => {
        try {
            const response = await navlinkService.updateNavlink(id, values);
            if (response?.status === HTTP_STATUS.OK) {
                navigate(makeRoute(ADMIN_ROUTES.NAVLINKS, {}));
                showSnackbar('success', 'Navlink updated successfully');
            }
        } catch (error) {
            console.log(error);
            showSnackbar('error', 'Failed to update navlink');
        }
    };

    const loadNavlink = async () => {
        try {
            const response = await navlinkService.getNavlinkById(id);
            if (response?.status === HTTP_STATUS.OK) {
                setNavlink(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadNavlink();
    }, []);

    return (
        <div>
            <NavlinkFormTemplate onSubmit={updateNavlink} mode={MODE.EDIT} navlink={navlink} />
        </div>
    );
};

export default NavlinkEditPage;