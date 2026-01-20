import React, { useRef, useState, useEffect } from "react";
import { useColors } from "../../../utils/types";
import { type DocumentUploadResponse } from "../../../services/useResumeService";
import {FiUpload,FiCheck,FiAlertCircle,FiInfo,FiTrash2} from "react-icons/fi";
import {FaFilePdf,FaFileExcel,FaFilePowerpoint,FaFileWord,FaFileCsv} from "react-icons/fa";
import type { IconType } from "react-icons";

interface DocumentValue {
  id?: string;
  name: string;
  url: string;
}

interface DocumentUploadProps {
  label?: string;
  value?: DocumentValue | null;
  onChange: (value: DocumentValue | null) => void;
  onUpload: (file: File) => Promise<DocumentUploadResponse>;
  accept?: string;
  disabled?: boolean;
  maxSize?: number;
  className?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  value,
  onChange,
  onUpload,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt",
  disabled = false,
  maxSize = 10,
  className = "",
  error = false,
  helperText,
  required = false,
  placeholder,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    setUploadError(null);
    setUploadSuccess(false);
  }, [value]);

  const validateFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSize}MB`);
      return false;
    }
    setUploadError(null);
    return true;
  };

  const handleFileSelect = async (file: File) => {
    if (!file || disabled) return;
    if (!validateFile(file)) return;
    setLoading(true);
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const result = await onUpload(file);
      onChange({
        id: result.id,
        name: result.fileName,
        url: result.fileUrl,
      });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch {
      setUploadError("Upload failed. Please try again.");
      setUploadSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    handleFileSelect(files[0]);
  };

  const handleRemove = () => {
    onChange(null);
    setUploadError(null);
    setUploadSuccess(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const hasError = error || !!uploadError;
  const displayHelperText = uploadError || helperText;

  const getFileIcon = (fileName: string): { Icon: IconType; color: string } => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return { Icon: FaFilePdf, color: "#DC2626" };
      case "doc":
      case "docx":
        return { Icon: FaFileWord, color: "#2563EB" };
      case "xls":
      case "xlsx":
        return { Icon: FaFileExcel, color: "#16A34A" };
      case "ppt":
      case "pptx":
        return { Icon: FaFilePowerpoint, color: "#EA580C" };
      case "csv":
        return { Icon: FaFileCsv, color: "#059669" };
      default:
        return { Icon: FaFileWord, color: "#6B7280" };
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="flex items-center text-sm font-medium"
          style={{ color: colors.neutral800 }}
        >
          {label}
          {required && <span className="ml-1" style={{ color: colors.error500 }}>*</span>}
        </label>
      )}
      {!value ? (
        <div className={`relative rounded-xl border-2 transition-all duration-300 p-4 text-center ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          } ${hasError ? "border-error500 bg-error50" : "border-dashed border-neutral300 bg-neutral50"}`}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            hidden
            disabled={disabled}
            onChange={(e) => handleSelect(e.target.files)}
          />

          <div className="flex flex-col items-center space-y-2">
            <FiUpload
              className="w-8 h-8 sm:w-10 sm:h-10"
              style={{ color: hasError ? colors.error500 : colors.neutral400 }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: hasError ? colors.error500 : colors.neutral700 }}
            >
              {placeholder || `Click to upload or drag and drop (${accept})`}
            </p>
          </div>

          {loading && (
            <div className="absolute inset-0 rounded-xl bg-white bg-opacity-90 flex items-center justify-center backdrop-blur-sm">
              <p className="text-sm font-medium" style={{ color: colors.warning500 }}>
                Uploading document...
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative rounded-xl border p-3 flex items-center justify-between space-x-3">
          <div className="flex items-center gap-3">
            {(() => {
              const { Icon, color } = getFileIcon(value.name);
              return <Icon className="w-6 h-6" style={{ color }} />;
            })()}
            <span className="text-sm font-medium truncate" style={{ color: colors.neutral800 }}>
              {value.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {uploadSuccess && (
              <FiCheck className="w-5 h-5 text-success500 animate-pulse" />
            )}
            {!disabled && (
              <button
                onClick={handleRemove}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-500 shadow hover:bg-red-50 transition-all duration-200"
                title="Remove document"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
      {displayHelperText && (
        <div className={`flex items-start space-x-2 text-xs sm:text-sm ${
            hasError ? "text-error500" : "text-neutral500"
          }`}>
          {hasError ? (
            <FiAlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: colors.error500 }} />
          ) : (
            <FiInfo className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: colors.neutral400 }} />
          )}
          <span>{displayHelperText}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
