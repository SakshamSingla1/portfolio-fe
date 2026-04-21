import React, { useEffect } from 'react';
import { useColors } from '../../../utils/types';

const ThemeInjector: React.FC = () => {
    const colors = useColors();

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-neutral-0', colors.neutral0);
        root.style.setProperty('--color-neutral-50', colors.neutral50);
        root.style.setProperty('--color-neutral-100', colors.neutral100);
        root.style.setProperty('--color-neutral-200', colors.neutral200);
        root.style.setProperty('--color-neutral-300', colors.neutral300);
        root.style.setProperty('--color-neutral-400', colors.neutral400);
        root.style.setProperty('--color-neutral-500', colors.neutral500);
        root.style.setProperty('--color-neutral-600', colors.neutral600);
        root.style.setProperty('--color-neutral-700', colors.neutral700);
        root.style.setProperty('--color-neutral-800', colors.neutral800);
        root.style.setProperty('--color-neutral-900', colors.neutral900);
        root.style.setProperty('--color-neutral-950', colors.neutral950);
        root.style.setProperty('--color-primary-50', colors.primary50);
        root.style.setProperty('--color-primary-100', colors.primary100);
        root.style.setProperty('--color-primary-200', colors.primary200);
        root.style.setProperty('--color-primary-300', colors.primary300);
        root.style.setProperty('--color-primary-400', colors.primary400);
        root.style.setProperty('--color-primary-500', colors.primary500);
        root.style.setProperty('--color-primary-600', colors.primary600);
        root.style.setProperty('--color-primary-700', colors.primary700);
        root.style.setProperty('--color-primary-800', colors.primary800);
        root.style.setProperty('--color-primary-900', colors.primary900);
        root.style.setProperty('--color-success-50', colors.success50);
        root.style.setProperty('--color-success-100', colors.success100);
        root.style.setProperty('--color-success-200', colors.success200);
        root.style.setProperty('--color-success-300', colors.success300);
        root.style.setProperty('--color-success-400', colors.success400);
        root.style.setProperty('--color-success-500', colors.success500);
        root.style.setProperty('--color-success-600', colors.success600);
        root.style.setProperty('--color-success-700', colors.success700);
        root.style.setProperty('--color-error-50', colors.error50);
        root.style.setProperty('--color-error-100', colors.error100);
        root.style.setProperty('--color-error-200', colors.error200);
        root.style.setProperty('--color-error-300', colors.error300);
        root.style.setProperty('--color-error-400', colors.error400);
        root.style.setProperty('--color-error-500', colors.error500);
        root.style.setProperty('--color-error-600', colors.error600);
        root.style.setProperty('--color-error-700', colors.error700);
        root.style.setProperty('--color-warning-50', colors.warning50);
        root.style.setProperty('--color-warning-100', colors.warning100);
        root.style.setProperty('--color-warning-200', colors.warning200);
        root.style.setProperty('--color-warning-300', colors.warning300);
        root.style.setProperty('--color-warning-400', colors.warning400);
        root.style.setProperty('--color-warning-500', colors.warning500);
        root.style.setProperty('--color-warning-600', colors.warning600);
        root.style.setProperty('--color-warning-700', colors.warning700);
        

    }, [colors]);

    return null;
};

export default ThemeInjector;
