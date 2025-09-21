import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Tooltip,
  Fade,
  Alert,
  Snackbar,
  styled
} from '@mui/material';
import { CloudUpload, Delete, Refresh, Image as ImageIcon } from '@mui/icons-material';

interface ProfileImageProps {
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

const StyledDropZone = styled(Box)<{ isDragging: boolean; error: boolean }>(({ theme, isDragging, error }) => ({
  border: `2px dashed ${error ? theme.palette.error.main : isDragging ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: '50%',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: isDragging ? theme.palette.action.hover : 'transparent',
  transition: theme.transitions.create(['border-color', 'background-color', 'transform'], { duration: theme.transitions.duration.shorter }),
  '&:hover': {
    borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
  },
  position: 'relative',
  overflow: 'hidden',
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '50%',
  transition: 'transform 0.3s ease',
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
  aspectRatio = '1/1',
  width = 200,
  height = 200,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const validateFile = (file: File) => {
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

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadError(null);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setPreview(data.secure_url);
      onChange(data.secure_url, file);
    } catch (err) {
      console.error(err);
      setUploadError('Failed to upload image. Please try again.');
      setSnackbarOpen(true);
      setPreview(null);
      onChange(null, null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Box width={width} height={height}>
      <Tooltip title={disabled ? '' : 'Click to upload or drag & drop'} arrow>
        <StyledDropZone
          isDragging={isDragging}
          error={!!error}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          sx={{ width, height }}
        >
          <VisuallyHiddenInput
            type="file"
            accept={accept}
            ref={fileInputRef}
            disabled={disabled}
            onChange={handleFileChange}
          />

          {isUploading ? (
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <CircularProgress size={36} />
              <Typography variant="body2" color="text.secondary">Uploading...</Typography>
            </Box>
          ) : preview ? (
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <PreviewImage src={preview} alt="Preview" />
              {!disabled && (
                <Fade in={true}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <Tooltip title="Replace">
                      <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        size="medium"
                        sx={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                      >
                        <Refresh fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove">
                      <IconButton
                        onClick={handleRemove}
                        size="medium"
                        sx={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Fade>
              )}
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <ImageIcon sx={{ fontSize: 48, opacity: 0.5 }} />
              <Typography variant="subtitle1">{label}</Typography>
              {helperText && <Typography variant="caption">{helperText}</Typography>}
            </Box>
          )}
        </StyledDropZone>
      </Tooltip>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setSnackbarOpen(false)}>
          {uploadError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileImage;
