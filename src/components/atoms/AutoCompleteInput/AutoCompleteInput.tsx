import React, { type SyntheticEvent, useCallback } from 'react';
import Autocomplete, { type AutocompleteChangeReason, type AutocompleteChangeDetails } from '@mui/material/Autocomplete';
import { ClearIcon } from '@mui/x-date-pickers';
import { createUseStyles } from 'react-jss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorMessage from '../../atoms/ErrorMessage/ErrorMessage';
import { useDebounce } from '../../../utils/helper';
import { DEBOUNCE_TIME } from '../../../utils/constant';
import TextField from '../TextField/TextField';

export interface AutoCompleteOption {
	label: any;
	value: number | string;
	title?: string;
}

const useStyles = createUseStyles((theme: any) => ({
	autoCompleteStyle: {
		"& .MuiOutlinedInput-root": {
			fontSize: '14px',
			lineHeight: '18px',
			height: '56px !important',
			padding: 0,
		},
		"& .MuiOutlinedInput-notchedOutline": {
			borderWidth: 0,
			borderColor: theme.palette.border.secondaryDark,
		},
	},
	label: {
		color: theme.palette.text.neutral.tertiary600,
		fontSize: "14px",
		fontWeight: 400,
		lineHeight: "30px"
	},
	"@media (max-width: 480px)": {
		label: {
			color: theme.palette.text.neutral.neutral600,
			fontSize: "30px",
			fontWeight: 400,
			lineHeight: "16.1px"
		},
	},
}));

interface AutoCompleteInputProps {
	label?: string;
	options: AutoCompleteOption[];
	onSearch: (value: string) => void;
	onChange: (option: AutoCompleteOption | null) => void;
	isDisabled?: boolean;
	value?: AutoCompleteOption | null;
	error?: boolean;
	helperText?: string;
	id?: string;
	placeHolder?: string;
	onBlur?: () => void;
}

const AutoCompleteInputV3: React.FC<AutoCompleteInputProps> = ({
	label,
	options,
	onSearch,
	onChange,
	isDisabled,
	value,
	error = false,
	helperText = '',
	placeHolder = '',
	id,
	onBlur
}) => {
	const handleInputChange = useCallback((
		value: AutoCompleteOption | null, 
		reason: AutocompleteChangeReason, 
	) => {
		// Only call the parent's onChange when the value actually changes
		if (reason === 'selectOption' || reason === 'removeOption' || reason === 'clear') {
			onChange(value);
		}
	}, [onChange]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		debouncedSearch(e.target.value);
	};

	const handleClearValue = () => {
		onSearch("");
	};

	const defaultProps = {
		options: options,
		getOptionLabel: (option: AutoCompleteOption) => {
			return typeof option.title === 'string' && option.title.trim() !== '' ? option.title : String(option.label ?? '');
		},
		isOptionEqualToValue: (option: AutoCompleteOption, value: AutoCompleteOption) =>
			option.value === value.value,
	};

	const debouncedSearch = useCallback(
		useDebounce((value: string) => {
			onSearch(value);
		}, DEBOUNCE_TIME.DEFAULT),
		[onSearch]
	);

	const classes = useStyles();

	return (
		<div className={`flex flex-col w-full relative ${isDisabled ? 'pointer-events-none select-none' : ''}`}>
			{label && (
				<div className={classes.label}>
					{label}
				</div>
			)}
			<Autocomplete
				className={`${classes.autoCompleteStyle}`}
				id={id ?? label}
				{...defaultProps}
				fullWidth
				disabled={isDisabled}
				clearText=""
				onFocus={handleClearValue}
				popupIcon={<ExpandMoreIcon />}
				clearIcon={value?.label === '' ? '' : <ClearIcon onClick={handleClearValue} />}
				renderInput={(params) => (
					<TextField
                        placeholder={placeHolder}
                        {...params}
                        label=""
                        onChange={handleSearch}
                        error={error}
                        helperText={helperText}
					/>
				)}
				renderOption={(props, option) => {
					const { key, ...otherProps } = props;
					return (
						<li key={key} {...otherProps}>
							{option.label}
						</li>
					);
				}}
				onChange={(value, reason) => handleInputChange(value, reason)}
				value={value}
				onBlur={onBlur}
			/>

			{error && !!helperText && <ErrorMessage message={helperText} />}
		</div>
	);
};

export default AutoCompleteInputV3;