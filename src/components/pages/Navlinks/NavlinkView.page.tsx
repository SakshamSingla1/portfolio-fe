import React, { useEffect, useState } from 'react';
import { useNavlinkService, type NavlinkResponse } from '../../../services/useNavlinkService';
import { HTTP_STATUS } from '../../../utils/types';
import NavlinkFormTemplate from '../../templates/Navlinks/NavlinkForm.template';
import { MODE } from '../../../utils/constant';
import { useParams } from 'react-router-dom';

const NavlinkViewPage: React.FC = () => {
    const params = useParams();
    const id = String(params.id);

    const navlinkService = useNavlinkService();

    const [navlink, setNavlink] = useState<NavlinkResponse | null>(null);

    const loadNavlink = async (id: string) => {
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
        if(id)
        loadNavlink(id);
    }, [id]);

    return (
        <div>
            <NavlinkFormTemplate onSubmit={() => {}} mode={MODE.VIEW} navlink={navlink} />
        </div>
    );
};

export default NavlinkViewPage;