import { useRef, useCallback } from 'react';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { createSearchParams, generatePath } from "react-router-dom";
import type { MakeRouteParams } from "./types";
import type { ColorTheme } from "../services/useColorThemeService";

export const capitalizeFirstLetter = (input: string) => {
  if (!input) return '';
  return `${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`;
};

export const convertToCamelCase = (input: string) => {
  return input?.split(" ")?.map(el => capitalizeFirstLetter(el))?.join(" ");
};


export const replaceUrlParams = (url: string, params: Record<string, any>) => {
  let result = url;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, value);
  }
  return result;
};

export const useDebounce = <T extends any[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return useCallback((...args: T) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay);
  }, [delay]);
};


export const DateUtils = {
  formatDateTimeToDate: (dateTime: string): string => {
    return dayjs(dateTime, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY");
  },

  unixToDate: (unix: number): string => {
    return dayjs.unix(unix).format("DD-MM-YYYY");
  },

  dateToUnix: (date: string): number => {
    return dayjs(date, "DD-MM-YYYY").unix();
  },

  unixToDateTime: (unix: number): string => {
    return dayjs.unix(unix).format("DD-MM-YYYY HH:mm:ss");
  },

  dateTimeToUnix: (dateTime: string): number | null => {
    if (!dateTime) return null;
    return dayjs(dateTime, "DD-MM-YYYY HH:mm:ss").unix();
  },

  dateTimeSecondToDate: (dateTime: string): string => {
    return dayjs(dateTime).format("DD-MM-YYYY");
  },

  unixToYYYYMMDD: (unix: number): string => {
    return dayjs.unix(unix).format("YYYY-MM-DD");
  },

  dateTimeSecondToDateTime: (dateTime: string): string => {
    if (!dateTime) return "No Data";
    return dayjs(dateTime).format("DD-MM-YYYY HH:mm");
  },

  formatDateTimeToDateMonthYear: (dateTime: string): string => {
    return dayjs(dateTime).format("D-MMM-YYYY");
  },
};

export const getInitials = (str: string): string => {
  if (!str) return '';
  const words = str.trim().split(/\s+/);
  if (words.length === 1) {
    return str.substring(0, 1).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};


export const titleModification = (title: string) => {
  return title.charAt(0).toUpperCase() + title.slice(1);
};

export const makeRoute = (
	baseRoute: string,
	{ params, query }: MakeRouteParams
): string => {
	const queryString = createSearchParams(query ?? {});
	return `${generatePath(baseRoute, params ?? {})}${queryString ? `?${queryString}` : ''
		}`;
};

export const getColor = (theme: ColorTheme | null,colorName: string) => {
    if(!theme?.palette?.colorGroups) return "";
    for( const group of theme.palette.colorGroups){
        for(const shade of group.colorShades){
            if(shade.colorName === colorName) return shade.colorCode;
        }
    }
    return "";
}

export const userNameMaker = (email: string): string => {
    if (!email) return 'user';
    return email.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '') || 'user';
}

export const getBreadcrumbsFromUrl = (pathname: string): Array<{ label: string; path: string }> => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  let currentPath = '';
  for (const segment of pathSegments) {
    currentPath = `${currentPath}/${segment}`;
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbs.push({ label, path: currentPath });
  }
  return breadcrumbs;
};

export const formatToEnumKey = (name: string) => {
	return name
		.toUpperCase()
		.replace(/\s+/g, '_')
		.replace(/[^A-Z0-9]/g, '_')
		.replace(/_+/g, '_')
		.replace(/^_+/, '')
		.replace(/_+$/, '');
};

export const enumToNormalKey = (enumKey: string): string => {
  return enumKey
    .toLowerCase()
    .split('_')
    .map(word => word === 'and' ? '&' : word)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


export const isRichTextEmpty = (value?: string) => {
    if (!value) return true;
    const plainText = value
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, "")
        .trim();

    return plainText.length === 0;
};

/** Applies a Cloudinary f_auto/q_auto/w_* transform so an image is served at
 * the size it's actually displayed at, instead of its full original upload
 * resolution. Mirrors portfolio-main's helper of the same name. */
export const getOptimizedImageUrl = (
  url: string | null | undefined,
  options: { width?: number; height?: number; quality?: string } = {}
): string => {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }

  const parts = url.split("/image/upload/");
  if (parts.length !== 2) return url;

  const transformations: string[] = ["f_auto"];
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.width || options.height) {
    transformations.push(options.width && options.height ? "c_fill" : "c_limit");
  }
  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  } else {
    transformations.push("q_auto");
  }

  const transformStr = transformations.join(",");
  return `${parts[0]}/image/upload/${transformStr}/${parts[1]}`;
};
