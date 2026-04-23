import React, { useState, useEffect } from 'react';
import { useColorThemeService, type ColorTheme } from "../../../services/useColorThemeService";
import { HTTP_STATUS } from '../../../utils/types';
import ColorThemeForm from '../../templates/ColorTheme/ColorThemeForm.template';
import { MODE } from '../../../utils/constant';
import { useParams } from 'react-router-dom';

const ColorThemeViewPage: React.FC = () => {
    const colorThemeService = useColorThemeService();
    const params = useParams();
    const themeId = String(params.id);
    const [colorTheme, setColorTheme] = useState<ColorTheme | null>(null);

    const loadColorThemeData = async () => {
        colorThemeService.getColorThemeById(themeId)
            .then((res: any) => {
                if (res.status === HTTP_STATUS.OK) {
                    setColorTheme(res.data.data);
                }
            })
    }


    useEffect(() => {
        if (!themeId) return;
        loadColorThemeData();
    }, [themeId]);

    return (
        <div>
            <ColorThemeForm onSubmit={() => { }} mode={MODE.VIEW} colorTheme={colorTheme} />
        </div>
    );
};

export default ColorThemeViewPage;
