import moment from "moment";
import { REGEX } from "./constant";
import { createSearchParams, generatePath } from "react-router-dom";
import type { IOption, MakeRouteParams } from "./types";
import type { ColorTheme } from "../services/useColorThemeService";

export const capitalizeFirstLetter = (input: string) => {
  if (!input) return '';
  return `${input.charAt(0).toUpperCase()}${input.slice(1).toLowerCase()}`;
};

export const convertToCamelCase = (input: string) => {
  return input?.split(" ")?.map(el => capitalizeFirstLetter(el))?.join(" ");
};

export const validatePhoneNumber = (phoneNumber: string) => {
  return REGEX.PHONE_NUMBER.test(phoneNumber);
};

export const snakeCaseToTitleCase = (str: string) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
};

export const timeToLocale = (
  timeInSeconds: number,
  maximumUnitOfTime: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
) => {
  const timeUnits = [
    { unit: 'year', value: 31536000 },
    { unit: 'month', value: 2592000 },
    { unit: 'week', value: 604800 },
    { unit: 'day', value: 86400 },
    { unit: 'hour', value: 3600 },
    { unit: 'minute', value: 60 },
    { unit: 'second', value: 1 },
  ];

  let result = '';
  const availableTimeUnits = timeUnits.slice(
    timeUnits.findIndex((timeUnit) => timeUnit.unit === maximumUnitOfTime)
  );

  for (const timeUnit of availableTimeUnits) {
    const unitCount = Math.floor(timeInSeconds / timeUnit.value);
    timeInSeconds %= timeUnit.value;
    if (unitCount > 0) {
      result += `${result ? ',' : ''}${unitCount} ${timeUnit.unit}${unitCount > 1 ? 's' : ''}`;
    }
  }

  return result;
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
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

const saveToSessionStorage = (newObject: any) => {
  sessionStorage.setItem('history', JSON.stringify(newObject));
};

export const getListFromSessionStorage = (key: string) => {
  const list = sessionStorage.getItem(key);
  return list ? JSON.parse(list) : [];
};

export const addToQueue = (newObject: any) => {
  const list = getListFromSessionStorage('history');
  if (list.length > 0 && JSON.stringify(list[list.length - 1]) === JSON.stringify(newObject)) {
    return;
  }

  list.push(newObject);
  if (list.length > 10) {
    list.shift();
  }
  saveToSessionStorage(list);
};

export const DateUtils = {
  formatDateTimeToDate: (dateTime: string): string => {
    return moment(dateTime, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY");
  },

  unixToDate: (unix: number): string => {
    return moment.unix(unix).format("DD-MM-YYYY");
  },

  dateToUnix: (date: string): number => {
    return moment(date, "DD-MM-YYYY").unix();
  },

  unixToDateTime: (unix: number): string => {
    return moment.unix(unix).format("DD-MM-YYYY HH:mm:ss");
  },

  dateTimeToUnix: (dateTime: string): number | null => {
    if (!dateTime) return null;
    return moment(dateTime, "DD-MM-YYYY HH:mm:ss").unix();
  },

  dateTimeSecondToDate: (dateTime: string): string => {
    return moment(dateTime).format("DD-MM-YYYY");
  },

  unixToYYYYMMDD: (unix: number): string => {
    return moment.unix(unix).format("YYYY-MM-DD");
  },

  dateTimeSecondToDateTime: (dateTime: string): string => {
    if (!dateTime) return "No Data";
    return moment(dateTime).format("DD-MM-YYYY HH:mm");
  },

  formatDateTimeToDateMonthYear: (dateTime: string): string => {
    return moment(dateTime, "YYYY-MM-DD HH:mm:ss").format("D-MMM-YYYY");
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

export const createFileFromUrl = (url: string): File => {
  if (!url) return new File([], '-', { type: 'image/jpeg' });
  const fullPath = url?.split('.com/')[1]?.split('?')[0] ?? '';
  const pathParts = fullPath.split('/');
  const filename = pathParts[pathParts.length - 1] || 'file';
  return new File([new Blob([url])], filename, { type: 'image/jpeg' });
};

export const OptionToValue = (options: IOption[], value: string): string | number | React.ReactNode | undefined => {
  return options.find((option: IOption) => option.value === value)?.label;
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