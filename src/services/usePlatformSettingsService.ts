import { API_METHOD } from "../utils/constant";
import { request } from ".";

const URLS = {
    PUBLIC_GET: "/public/platform-settings",
};

export interface IPlatformSettings {
    bannerImageUrl: string | null;
    bannerAssetId: string | null;
}

export const usePlatformSettingsService = () => {
    const getSettings = () =>
        request(API_METHOD.GET, URLS.PUBLIC_GET, null, null);

    return { getSettings };
};

export default usePlatformSettingsService;
