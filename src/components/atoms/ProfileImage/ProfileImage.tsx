import React, { useRef, useState, useEffect } from 'react';
import {
    Box,
    Typography,
    styled,
    IconButton,
    CircularProgress,
    Tooltip,
    Fade,
    Alert,
    Snackbar,
} from '@mui/material';
import { CloudUpload, Delete, Image as ImageIcon, ErrorOutline } from '@mui/icons-material';

interface ProfileImageProps {
    value?: string | null;
    onChange: (url: string | null) => void;
    disabled?: boolean;
    maxSizeMB?: number;
    accept?: string;
    label?: string;
    helperText?: string;
    error?: boolean;
    aspectRatio?: number | string;
    width?: number | string;
    height?: number | string;
}

const CLOUDINARY_CLOUD_NAME = 'dwveckkwz';
const CLOUDINARY_UPLOAD_PRESET = 'portfolio_unsigned_upload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const StyledDropZone = styled(Box, {
    shouldForwardProp: (prop) => !['isDragging', 'error'].includes(prop as string),
})<{ isDragging: boolean; error: boolean }>(({ theme, isDragging, error }) => ({
    border: `2px dashed ${
        error 
            ? theme.palette.error.main 
            : isDragging 
            ? theme.palette.primary.main 
            : 'rgba(0, 0, 0, 0.12)'
    }`,
    borderRadius: '8px',
    padding: '32px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.04)' : '#ffffff',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    aspectRatio: '16/9',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    '&:hover': {
        borderColor: error ? theme.palette.error.dark : theme.palette.primary.dark,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
}));

const PreviewImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '4px',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.02)',
    },
});

const ProfileImage: React.FC<ProfileImageProps> = ({
    value,
    onChange,
    disabled = false,
    maxSizeMB = 5,
    accept = 'image/*',
    label = 'Upload Image',
    helperText,
    error = false,
    aspectRatio = '16/9',
    width = '100%',
    height = 'auto',
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreview(value || null);
    }, [value]);

    const showErrorAlert = (message: string) => {
        setErrorMessage(message);
        setShowError(true);
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    const validateFile = (file: File): boolean => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            showErrorAlert(`File size should be less than ${maxSizeMB}MB`);
            return false;
        }

        const acceptedTypes = accept.split(',').map(type => type.trim());
        if (!acceptedTypes.some(type => {
            if (type === 'image/*') return file.type.startsWith('image/');
            return file.type === type || file.name.endsWith(type.replace('image/', '.'));
        })) {
            showErrorAlert(`Invalid file type. Please upload ${accept}`);
            return false;
        }

        return true;
    };

    const handleFileChange = async (file: File | null) => {
        if (!file || disabled) return;

        if (!validateFile(file)) {
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            
            if (!res.ok) {
                throw new Error(`Upload failed with status: ${res.status}`);
            }

            const data = await res.json();
            if (data.secure_url) {
                setPreview(data.secure_url);
                onChange(data.secure_url);
            } else {
                throw new Error('No secure URL returned from Cloudinary');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showErrorAlert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileChange(file);
    };

    const handleClick = () => {
        if (fileInputRef.current && !disabled) {
            fileInputRef.current.click();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileChange(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        setPreview(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Box sx={{ width, maxWidth: '100%' }}>
            <Tooltip title={disabled ? '' : 'Click to upload or drag and drop'} arrow>
                <Box>
                    <StyledDropZone
                        isDragging={isDragging}
                        error={error}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleClick}
                        sx={{
                            opacity: disabled ? 0.7 : 1,
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            height,
                            aspectRatio,
                        }}
                    >
                        <VisuallyHiddenInput
                            type="file"
                            ref={fileInputRef}
                            onChange={handleInputChange}
                            accept={accept}
                            disabled={disabled}
                        />

                        {isUploading ? (
                            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                <CircularProgress size={48} thickness={2} />
                                <Typography variant="body2" color="text.secondary">
                                    Uploading...
                                </Typography>
                            </Box>
                        ) : preview ? (
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'hidden',
                                    borderRadius: '4px',
                                }}
                            >
                                <PreviewImage src={preview} alt="Preview" />
                                {!disabled && (
                                    <Fade in={true}>
                                        <IconButton
                                            onClick={handleRemove}
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                },
                                            }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Fade>
                                )}
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: 'text.secondary',
                                    padding: '16px',
                                    textAlign: 'center',
                                }}
                            >
                                <CloudUpload sx={{ fontSize: '48px', opacity: 0.7 }} />
                                <Typography variant="subtitle1" fontWeight={500}>
                                    {label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Drag & drop an image here, or click to select
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Supports: {accept.replace(/\*/g, '').toUpperCase()} (Max {maxSizeMB}MB)
                                </Typography>
                            </Box>
                        )}
                    </StyledDropZone>

                    {helperText && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: error ? 'error.main' : 'text.secondary',
                                mt: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                            }}
                        >
                            {error && <ErrorOutline fontSize="inherit" />}
                            {helperText}
                        </Typography>
                    )}

                    <Snackbar
                        open={showError}
                        autoHideDuration={6000}
                        onClose={handleCloseError}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={handleCloseError}
                            severity="error"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {errorMessage}
                        </Alert>
                    </Snackbar>
                </Box>
            </Tooltip>
        </Box>
    );
};

export default ProfileImage;