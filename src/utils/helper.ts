export const replaceUrlParams = (url: string, params: { [key: string]: any }) => {
    for (const key in params) {
        url = url.replace(`:${key}`, params[key]);
    }
    return url;
};

export const titleModification = (title: string) => {
    return title.charAt(0).toUpperCase() + title.slice(1);
};

export const makeRoute = (route: string, params: { [key: string]: any }) => {
    return replaceUrlParams(route, params);
};

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};