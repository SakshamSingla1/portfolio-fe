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
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material';

export type UploadMode = 'single' | 'multiple' | 'logo';

export interface ImageFile {
    id: string;
    url: string;
    file?: File;
    name?: string;
}

interface BaseImageUploadProps {
    disabled?: boolean;
    maxSizeMB?: number;
    accept?: string;
    label?: string;
    helperText?: string;
    error?: boolean;
    aspectRatio?: number | string;
    width?: number | string;
    height?: number | string;
    uploadMode?: UploadMode;
    maxFiles?: number;
}

interface SingleImageUploadProps extends BaseImageUploadProps {
    uploadMode?: 'single';
    value?: string | null;
    onChange: (url: string | null, file?: File | null) => void;
}

interface MultipleImageUploadProps extends BaseImageUploadProps {
    uploadMode: 'multiple';
    value?: ImageFile[];
    onChange: (images: ImageFile[]) => void;
}

interface LogoImageUploadProps extends BaseImageUploadProps {
    uploadMode: 'logo';
    value?: string | null;
    onChange: (url: string | null, file?: File | null) => void;
}

type ImageUploadProps = SingleImageUploadProps | MultipleImageUploadProps | LogoImageUploadProps;

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

const ImageUpload: React.FC<ImageUploadProps> = (props) => {
    const {
        disabled = false,
        maxSizeMB = 5,
        accept = 'image/*',
        label = 'Upload Image',
        helperText,
        error = false,
        aspectRatio = '16/9',
        width = '100%',
        height = 'auto',
        uploadMode = 'single',
        maxFiles = 10,
    } = props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(
        uploadMode === 'multiple' ? null : (props.value as string) || null
    );
    const [multipleImages, setMultipleImages] = useState<ImageFile[]>(
        uploadMode === 'multiple' ? (props.value as ImageFile[]) || [] : []
    );

    useEffect(() => {
        if (uploadMode === 'multiple') {
            setMultipleImages((props.value as ImageFile[]) || []);
        } else {
            setPreview((props.value as string) || null);
        }
    }, [props.value, uploadMode]);

    // Get upload mode specific configurations
    const getUploadConfig = () => {
        switch (uploadMode) {
            case 'logo':
                return {
                    aspectRatio: '1/1',
                    maxSizeMB: 2,
                    accept: 'image/png, image/svg+xml, image/jpeg',
                    label: label || 'Upload Logo',
                    helperText: helperText || 'PNG, SVG, JPG up to 2MB. Square format recommended.',
                    minHeight: '150px',
                    maxWidth: '200px',
                };
            case 'multiple':
                return {
                    aspectRatio: aspectRatio,
                    maxSizeMB: maxSizeMB,
                    accept: accept,
                    label: label || 'Upload Images',
                    helperText: helperText || `Select multiple images (max ${maxFiles}). ${accept} up to ${maxSizeMB}MB each.`,
                    minHeight: '200px',
                    maxWidth: '100%',
                };
            default: // single
                return {
                    aspectRatio: aspectRatio,
                    maxSizeMB: maxSizeMB,
                    accept: accept,
                    label: label,
                    helperText: helperText || `${accept} up to ${maxSizeMB}MB`,
                    minHeight: '180px',
                    maxWidth: '100%',
                };
        }
    };

    const config = getUploadConfig();

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
        if (file.size > config.maxSizeMB * 1024 * 1024) {
            setUploadError(`File size must be under ${config.maxSizeMB}MB`);
            setSnackbarOpen(true);
            return false;
        }
        if (!file.type.startsWith('image/')) {
            setUploadError('Please upload an image file');
            setSnackbarOpen(true);
            return false;
        }
        
        // Additional validation for logo mode
        if (uploadMode === 'logo') {
            const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                setUploadError('Logo must be PNG, SVG, or JPG format');
                setSnackbarOpen(true);
                return false;
            }
        }
        
        return true;
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        if (disabled) return;
        
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length === 0) return;
        
        if (uploadMode === 'multiple') {
            await processMultipleFiles(files);
        } else {
            await processFile(files[0]);
        }
    };

    const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        
        if (uploadMode === 'multiple') {
            await processMultipleFiles(files);
        } else {
            await processFile(files[0]);
        }
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
            formData.append('upload_preset', import.meta.env.CLOUDINARY_UPLOAD_PRESET);
            
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            
            const data = await response.json();
            (props.onChange as SingleImageUploadProps['onChange'])(data.secure_url, file);
            
        } catch (err) {
            console.error('Upload error:', err);
            setUploadError('Failed to upload image. Please try again.');
            setSnackbarOpen(true);
            setPreview(null);
            (props.onChange as SingleImageUploadProps['onChange'])(null, null);
        } finally {
            setIsUploading(false);
        }
    };

    const processMultipleFiles = async (files: File[]) => {
        const validFiles = files.filter(validateFile);
        if (validFiles.length === 0) return;

        // Check if adding these files would exceed maxFiles
        if (multipleImages.length + validFiles.length > maxFiles) {
            setUploadError(`Maximum ${maxFiles} images allowed`);
            setSnackbarOpen(true);
            return;
        }

        try {
            setIsUploading(true);
            setUploadError(null);

            const uploadPromises = validFiles.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', import.meta.env.CLOUDINARY_UPLOAD_PRESET);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error(`Upload failed for ${file.name}`);
                }

                const data = await response.json();
                return {
                    id: data.public_id,
                    url: data.secure_url,
                    file,
                    name: file.name,
                };
            });

            const uploadedImages = await Promise.all(uploadPromises);
            const newImages = [...multipleImages, ...uploadedImages];
            setMultipleImages(newImages);
            (props.onChange as MultipleImageUploadProps['onChange'])(newImages);

        } catch (err) {
            console.error('Upload error:', err);
            setUploadError('Failed to upload some images. Please try again.');
            setSnackbarOpen(true);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (uploadMode === 'multiple') {
            setMultipleImages([]);
            (props.onChange as MultipleImageUploadProps['onChange'])([]);
        } else {
            setPreview(null);
            (props.onChange as SingleImageUploadProps['onChange'])(null, null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (imageId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newImages = multipleImages.filter(img => img.id !== imageId);
        setMultipleImages(newImages);
        (props.onChange as MultipleImageUploadProps['onChange'])(newImages);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box width={width} maxWidth={config.maxWidth}>
            <Tooltip title={disabled ? '' : 'Click or drag & drop to upload'} arrow>
                <StyledDropZone
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    isDragging={isDragging}
                    error={!!error}
                    sx={{
                        aspectRatio: config.aspectRatio,
                        height: height,
                        minHeight: config.minHeight,
                        position: 'relative',
                        ...(uploadMode === 'logo' && {
                            borderRadius: '50%',
                            margin: '0 auto',
                        }),
                    }}
                >
                    {isUploading ? (
                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                            <CircularProgress size={24} />
                            <Typography variant="body2" color="textSecondary">
                                Uploading...
                            </Typography>
                        </Box>
                    ) : uploadMode === 'multiple' && multipleImages.length > 0 ? (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                            <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                gap: 1,
                                p: 1,
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}>
                                {multipleImages.map((image) => (
                                    <Box key={image.id} sx={{ position: 'relative', aspectRatio: '1/1' }}>
                                        <img 
                                            src={image.url} 
                                            alt={image.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        {!disabled && (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={(e) => handleRemoveImage(image.id, e)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: -8,
                                                    right: -8,
                                                    backgroundColor: 'white',
                                                    '&:hover': { backgroundColor: 'white' },
                                                    boxShadow: 1
                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                            {multipleImages.length < maxFiles && (
                                <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)' }}>
                                    Click to add more ({multipleImages.length}/{maxFiles})
                                </Typography>
                            )}
                        </Box>
                    ) : preview ? (
                        <>
                            <PreviewImage 
                                src={preview} 
                                alt="Preview" 
                                sx={{
                                    ...(uploadMode === 'logo' && {
                                        borderRadius: '50%',
                                    })
                                }}
                            />
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
                                        ...(uploadMode === 'logo' && {
                                            borderRadius: '50%',
                                        })
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
                            {uploadMode === 'logo' ? (
                                <ImageIcon fontSize="large" color={error ? 'error' : 'action'} />
                            ) : (
                                <CloudUpload fontSize="large" color={error ? 'error' : 'action'} />
                            )}
                            <Typography variant="subtitle1" color={error ? 'error' : 'textSecondary'}>
                                {config.label}
                            </Typography>
                            <Typography variant="caption" color={error ? 'error' : 'textSecondary'}>
                                {config.helperText}
                            </Typography>
                        </Box>
                    )}
                    <VisuallyHiddenInput
                        type="file"
                        accept={config.accept}
                        onChange={handleFileInputChange}
                        ref={fileInputRef}
                        disabled={disabled || (uploadMode === 'multiple' && multipleImages.length >= maxFiles)}
                        multiple={uploadMode === 'multiple'}
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
