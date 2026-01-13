import React, { useEffect, useState } from 'react';
import { useNavlinkService, type NavlinkResponse } from '../../../services/useNavlinkService';
import { HTTP_STATUS } from '../../../utils/types';
import NavlinkFormTemplate from '../../templates/Navlinks/NavlinkForm.template';
import { MODE } from '../../../utils/constant';
import { useParams } from 'react-router-dom';

const NavlinkViewPage: React.FC = () => {
    const params = useParams();
    const index = String(params.index);

    const navlinkService = useNavlinkService();

    const [navlink, setNavlink] = useState<NavlinkResponse | null>(null);

    const loadNavlink = async (index: string) => {
        try {
            const response = await navlinkService.getNavlinkByIndex(index);
            if (response?.status === HTTP_STATUS.OK) {
                setNavlink(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadNavlink(index);
    }, [index]);

    return (
        <div>
            <NavlinkFormTemplate onSubmit={() => {}} mode={MODE.VIEW} navlink={navlink} />
        </div>
    );
};

export default NavlinkViewPage;