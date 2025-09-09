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

interface ImageUploadProps {
    value?: string | null;
    onChange: (url: string | null, file?: File | null) => void;
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
            : theme.palette.divider
    }`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: theme.transitions.create(['border-color', 'background-color']),
    backgroundColor: isDragging ? theme.palette.action.hover : 'transparent',
    '&:hover': {
        borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
    },
    position: 'relative',
    overflow: 'hidden',
}));

const PreviewImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
});

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    disabled = false,
    maxSizeMB = 5,
    accept = 'image/*',
    label = 'Upload Image',
    helperText,
    error = false,
    aspectRatio = '16/9',
    width = '64px',
    height = 'auto',
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);

    useEffect(() => {
        setPreview(value || null);
    }, [value]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const validateFile = (file: File): boolean => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            setUploadError(`File size must be under ${maxSizeMB}MB`);
            setSnackbarOpen(true);
            return false;
        }
        if (!file.type.startsWith('image/')) {
            setUploadError('Please upload an image file');
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        if (disabled) return;
        
        const file = e.dataTransfer.files?.[0] || null;
        if (!file) return;
        
        await processFile(file);
    };

    const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;
        
        await processFile(file);
    };

    const processFile = async (file: File) => {
        if (!validateFile(file)) return;
        
        try {
            setIsUploading(true);
            setUploadError(null);
            
            // Create preview
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            
            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            
            const data = await response.json();
            onChange(data.secure_url, file);
            
        } catch (err) {
            console.error('Upload error:', err);
            setUploadError('Failed to upload image. Please try again.');
            setSnackbarOpen(true);
            setPreview(null);
            onChange(null, null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onChange(null, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box width={width}>
            <Tooltip title={disabled ? '' : 'Click or drag & drop to upload'} arrow>
                <StyledDropZone
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    isDragging={isDragging}
                    error={!!error}
                    sx={{
                        aspectRatio: aspectRatio,
                        height: height,
                        position: 'relative',
                    }}
                >
                    {isUploading ? (
                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                            <CircularProgress size={24} />
                            <Typography variant="body2" color="textSecondary">
                                Uploading...
                            </Typography>
                        </Box>
                    ) : preview ? (
                        <>
                            <PreviewImage src={preview} alt="Preview" />
                            <Fade in={!disabled}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0,
                                        transition: 'opacity 0.2s',
                                        '&:hover': {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    <IconButton
                                        color="error"
                                        onClick={handleRemove}
                                        size="large"
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Fade>
                        </>
                    ) : (
                        <Box textAlign="center">
                            <CloudUpload fontSize="large" color={error ? 'error' : 'action'} />
                            <Typography variant="subtitle1" color={error ? 'error' : 'textSecondary'}>
                                {label}
                            </Typography>
                            <Typography variant="caption" color={error ? 'error' : 'textSecondary'}>
                                {helperText || `PNG, JPG, GIF up to ${maxSizeMB}MB`}
                            </Typography>
                        </Box>
                    )}
                    <VisuallyHiddenInput
                        type="file"
                        accept={accept}
                        onChange={handleFileInputChange}
                        ref={fileInputRef}
                        disabled={disabled}
                    />
                </StyledDropZone>
            </Tooltip>
            
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {uploadError}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ImageUpload;
