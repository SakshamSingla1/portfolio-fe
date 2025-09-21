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
import { CloudUpload, Delete, Image as ImageIcon, Refresh } from '@mui/icons-material';

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
    shouldForwardProp: (prop) => !['isDragging', 'error', 'isLogo'].includes(prop as string),
})<{ isDragging: boolean; error: boolean; isLogo: boolean; disabled?: boolean }>(({ theme, isDragging, error, isLogo, disabled = false }) => ({
    border: `2px dashed ${
        error 
            ? theme.palette.error.main 
            : isDragging 
            ? theme.palette.primary.main 
            : theme.palette.divider
    }`,
    borderRadius: isLogo ? '50%' : theme.shape.borderRadius,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: theme.transitions.create(
        ['border-color', 'background-color', 'transform', 'box-shadow'],
        { duration: theme.transitions.duration.shorter }
    ),
    backgroundColor: isDragging ? theme.palette.action.hover : 'transparent',
    '&:hover': {
        borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
        boxShadow: theme.shadows[2],
        transform: 'translateY(-2px)',
    },
    '&:active': {
        transform: 'translateY(0)',
    },
    position: 'relative',
    overflow: 'hidden',
    opacity: disabled ? 0.7 : 1,
}));

const PreviewImage = styled('img')(({ theme }) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    transition: theme.transitions.create(['opacity', 'transform'], {
        duration: theme.transitions.duration.standard,
    }),
    '&:hover': {
        opacity: 0.9,
    },
}));

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
                    isLogo: true,
                };
            case 'multiple':
                return {
                    aspectRatio: aspectRatio,
                    maxSizeMB: maxSizeMB,
                    accept: accept,
                    label: label || 'Upload Images',
                    helperText: helperText || `Drag & drop images here`,
                    minHeight: '200px',
                    maxWidth: '100%',
                    isLogo: false,
                };
            default: // single
                return {
                    aspectRatio: aspectRatio,
                    maxSizeMB: maxSizeMB,
                    accept: accept,
                    label: label || 'Upload Image',
                    helperText: helperText || `Drag & drop an image here`,
                    minHeight: '180px',
                    maxWidth: '100%',
                    isLogo: false,
                };
        }
    };

    const config = getUploadConfig();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
            e.dataTransfer.dropEffect = 'copy';
        } else {
            e.dataTransfer.dropEffect = 'none';
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
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
            
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
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
                formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
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

    const renderUploadState = () => {
        if (isUploading) {
            return (
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    gap={1}
                    sx={{
                        padding: 2,
                        borderRadius: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    <CircularProgress size={24} thickness={4} />
                    <Typography variant="body2" color="textSecondary" align="center">
                        Uploading...
                    </Typography>
                </Box>
            );
        }

        if (uploadMode === 'multiple' && multipleImages.length > 0) {
            return (
                <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: 1.5,
                        p: 2,
                        maxHeight: '250px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: '3px',
                        },
                    }}>
                        {multipleImages.map((image) => (
                            <Box 
                                key={image.id} 
                                sx={{ 
                                    position: 'relative', 
                                    aspectRatio: '1/1',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    boxShadow: 1,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                        boxShadow: 3,
                                    },
                                }}
                            >
                                <img 
                                    src={image.url} 
                                    alt={image.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                                {!disabled && (
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={(e) => handleRemoveImage(image.id, e)}
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            '&:hover': { 
                                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                                transform: 'scale(1.1)',
                                            },
                                            transition: 'all 0.2s',
                                            width: 24,
                                            height: 24,
                                        }}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                    </Box>
                    {multipleImages.length < maxFiles && (
                        <Box 
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 70%, transparent 100%)',
                                padding: 1,
                                textAlign: 'center',
                            }}
                        >
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    display: 'inline-block',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 4,
                                    backdropFilter: 'blur(4px)',
                                    boxShadow: 1,
                                }}
                            >
                                {`${multipleImages.length} of ${maxFiles} images`} • Click to add more
                            </Typography>
                        </Box>
                    )}
                </Box>
            );
        }

        if (preview) {
            return (
                <>
                    <PreviewImage 
                        src={preview} 
                        alt="Preview" 
                        sx={{
                            ...(uploadMode === 'logo' && {
                                borderRadius: '50%',
                                objectFit: 'contain',
                                padding: 2,
                                backgroundColor: 'white',
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
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                display: 'flex',
                                flexDirection: 'column',
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
                            <Box 
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                    backgroundColor: 'transparent',
                                    padding: 2,
                                    borderRadius: 2,
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1.5,
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                    padding: 1,
                                    borderRadius: 2,
                                    backdropFilter: 'blur(4px)',
                                }}>
                                    <Tooltip title="Replace">
                                        <IconButton
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                            size="medium"
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                                    transform: 'scale(1.1)',
                                                },
                                                transition: 'all 0.2s ease-in-out',
                                                width: 36,
                                                height: 36,
                                                color: 'white',
                                                backdropFilter: 'blur(4px)',
                                            }}
                                        >
                                            <Refresh fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Remove">
                                        <IconButton
                                            color="error"
                                            onClick={handleRemove}
                                            size="medium"
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 100, 100, 0.4)',
                                                    transform: 'scale(1.1)',
                                                },
                                                transition: 'all 0.2s ease-in-out',
                                                width: 36,
                                                height: 36,
                                                color: 'white',
                                                backdropFilter: 'blur(4px)',
                                            }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                </>
            );
        }

        // Default upload state
        return (
            <Box 
                textAlign="center" 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 2,
                    width: '100%',
                    maxWidth: '300px',
                    margin: '0 auto',
                }}
            >
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        backgroundColor: error ? 'error.light' : 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: error ? 'error.contrastText' : 'primary.contrastText',
                        mb: 1,
                        opacity: disabled ? 0.5 : 1,
                    }}
                >
                    {uploadMode === 'logo' ? (
                        <ImageIcon fontSize="large" />
                    ) : (
                        <CloudUpload fontSize="large" />
                    )}
                </Box>
                <Box>
                    <Typography 
                        variant="subtitle1" 
                        color={error ? 'error' : 'textPrimary'}
                        fontWeight={500}
                        gutterBottom
                    >
                        {config.label}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color={error ? 'error' : 'textSecondary'}
                        sx={{
                            maxWidth: '280px',
                            lineHeight: 1.4,
                        }}
                    >
                        {config.helperText}
                    </Typography>
                </Box>
                {!disabled && (
                    <Typography 
                        variant="caption" 
                        color="textSecondary"
                        sx={{
                            mt: 1,
                            px: 2,
                            py: 0.5,
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                            display: 'inline-block',
                        }}
                    >
                        Click to browse files
                    </Typography>
                )}
            </Box>
        );
    };

    return (
        <Box width={width} maxWidth={config.maxWidth}>
            <Tooltip 
                title={
                    disabled 
                        ? 'Upload disabled' 
                        : isDragging 
                            ? 'Drop your files here' 
                            : 'Click or drag & drop to upload'
                } 
                arrow
                placement="top"
            >
                <StyledDropZone
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    isDragging={isDragging}
                    error={!!error}
                    isLogo={uploadMode === 'logo'}
                    sx={{
                        aspectRatio: config.aspectRatio,
                        height: height,
                        minHeight: config.minHeight,
                        position: 'relative',
                        ...(uploadMode === 'logo' && {
                            margin: '0 auto',
                            width: '200px',
                            height: '200px',
                        }),
                    }}
                    aria-label="File upload area"
                >
                    {renderUploadState()}
                    <VisuallyHiddenInput
                        type="file"
                        accept={config.accept}
                        onChange={handleFileInputChange}
                        ref={fileInputRef}
                        disabled={disabled || (uploadMode === 'multiple' && multipleImages.length >= maxFiles)}
                        multiple={uploadMode === 'multiple'}
                        aria-label="File input"
                    />
                </StyledDropZone>
            </Tooltip>
            
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Fade}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: 2,
                        boxShadow: 3,
                    },
                }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity="error" 
                    variant="filled"
                    sx={{
                        width: '100%',
                        '& .MuiAlert-message': {
                            display: 'flex',
                            alignItems: 'center',
                        },
                        '& .MuiAlert-icon': {
                            alignItems: 'center',
                        },
                    }}
                >
                    {uploadError}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ImageUpload;
