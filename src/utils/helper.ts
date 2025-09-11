import React from 'react';
import { IOption } from './types';

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

export const useDebounce = <T extends any[]>(
	callback: (...args: T) => void,
	delay: number
) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: T) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			callback(...args);
		}, delay);
	};
};

export const htmlToElement = (html: string) => {
	if (!html) return null;
	return React.createElement('div', { dangerouslySetInnerHTML: { __html: html } });
};

export const OptionToValue = (options: IOption[], value: string): string | number | React.ReactNode | undefined => {
    return options.find((option: IOption) => option.value === value)?.label;
};