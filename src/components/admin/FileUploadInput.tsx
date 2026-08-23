"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import {
  UploadCloud,
  FileImage,
  Video,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadInputProps {
  label: string;
  currentValue?: string | null;
  onChange: (newPath: string) => void;
  uploadType?: "image" | "video";
  uploadFolder?: string;
  accept?: string;
  required?: boolean;
  helperText?: string;
}

export function FileUploadInput({
  label,
  currentValue,
  onChange,
  uploadType = "image",
  uploadFolder = "images/products",
  accept,
  required = false,
  helperText,
}: FileUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultAccept =
    uploadType === "image"
      ? "image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
      : "video/mp4,video/webm,video/quicktime";

  const handleFile = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(`Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)...`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", uploadType);
      formData.append("folder", uploadFolder);

      // NOTE: Do NOT set Content-Type header manually. Let the browser append the multipart boundary.
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to upload file. Please try again.");
        setIsUploading(false);
        setUploadProgress(null);
        return;
      }

      onChange(data.url);
      setUploadProgress(null);
    } catch (err) {
      console.error("File upload error:", err);
      setError("Network error during file upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset file input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  const hasValue = Boolean(currentValue && currentValue.trim().length > 0);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-navy-200">
          {label} {required && <span className="text-gold-400">*</span>}
        </label>
        {helperText && <span className="text-[11px] text-navy-400">{helperText}</span>}
      </div>

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept || defaultAccept}
        onChange={handleInputChange}
        className="hidden"
        aria-label={label}
      />

      {/* Existing Value / Preview state */}
      {hasValue && !isUploading && (
        <div className="rounded-base border border-navy-700 bg-navy-950/90 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {uploadType === "image" ? (
              <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-navy-800 bg-navy-900 flex items-center justify-center text-gold-400">
                <Image
                  src={currentValue!}
                  alt="Upload preview"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-navy-800 bg-navy-900 flex items-center justify-center text-gold-400">
                <Video className="h-6 w-6" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-white truncate">
                  {currentValue?.split("/").pop() || "Uploaded file"}
                </span>
              </div>
              <p className="text-[11px] text-navy-400 font-mono truncate mt-0.5">
                {currentValue}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-base border border-navy-700 bg-navy-900 text-xs font-medium text-navy-200 hover:text-white hover:border-gold-400/40 transition-colors cursor-pointer"
              title="Replace with a new file"
            >
              <RefreshCw className="h-3 w-3 text-gold-400" />
              <span className="hidden sm:inline">Replace</span>
            </button>

            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center justify-center h-7 w-7 rounded-base border border-rose-500/30 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 hover:border-rose-500/50 transition-colors cursor-pointer"
              title="Remove file"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Uploading State */}
      {isUploading && (
        <div className="rounded-base border border-gold-500/30 bg-navy-950/90 p-4 flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-gold-400 animate-spin shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white">Uploading file to server...</p>
            <p className="text-[11px] text-navy-300 truncate mt-0.5">{uploadProgress}</p>
          </div>
        </div>
      )}

      {/* Dropzone / Upload Trigger Button (when no file or replacing) */}
      {!hasValue && !isUploading && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "group relative flex flex-col items-center justify-center rounded-base border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-200",
            isDragging
              ? "border-gold-400 bg-gold-500/10"
              : "border-navy-700 bg-navy-950/60 hover:border-gold-400/50 hover:bg-navy-950"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 mb-2 transition-transform group-hover:scale-110">
            {uploadType === "image" ? (
              <UploadCloud className="h-4.5 w-4.5" />
            ) : (
              <Video className="h-4.5 w-4.5" />
            )}
          </div>

          <p className="text-xs font-medium text-navy-200 group-hover:text-white">
            <span className="text-gold-400 font-semibold">Click to select file</span> or drag & drop here
          </p>

          <p className="text-[11px] text-navy-400 mt-1">
            {uploadType === "image"
              ? "JPG, PNG, WebP, SVG or GIF (Max 10MB)"
              : "MP4 or WebM video (Max 100MB)"}
          </p>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="flex items-center gap-2 rounded-base border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
