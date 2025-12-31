"use client";

import { useEffect, useState } from "react";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  useFormContext,
} from "react-hook-form";
import { CldImage } from "next-cloudinary";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "./ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload, Loader2, Eye, Trash2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  defaultValue?: string;
}

interface UploadResponse {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  size: number;
}

const ImageUpload = <T extends FieldValues>({
  name,
  control,
  label,
  description,
  disabled = false,
  defaultValue = "/logo.png",
}: ImageUploadProps<T>) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<UploadResponse | null>(null);
  const defaultImage = defaultValue;

  const { setValue, getValues } = useFormContext<T>();

  useEffect(() => {
    const currentValue = getValues(name);
    if (!currentValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(name, defaultImage as any);
    }
  }, [setValue, getValues, name, defaultImage]);

  const uploadImage = async (file: File, onChange: (url: string) => void) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Upload failed");
        const fileInput = document.getElementById(
          `upload-${name}`
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
        return;
      }

      const data: UploadResponse = await response.json();
      onChange(data.url);
      setUploadInfo(data);

      console.log("Upload successful:", {
        url: data.url,
        publicId: data.publicId,
        size: `${(data.size / 1024).toFixed(1)} KB`,
        dimensions: `${data.width}x${data.height}`,
        format: data.format,
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
      const fileInput = document.getElementById(
        `upload-${name}`
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (
    publicId: string,
    onChange: (url: string) => void
  ) => {
    if (!publicId) return;

    setDeleting(true);
    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Delete failed");
      }

      onChange(defaultImage);
      setUploadInfo(null);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete image. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const removeImage = (onChange: (url: string) => void) => {
    if (uploadInfo?.publicId) {
      deleteImage(uploadInfo.publicId, onChange);
    } else {
      onChange(defaultImage);
      setUploadInfo(null);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const currentValue = field.value || defaultImage;
        const isDefaultImage = currentValue === defaultImage;
        const isCloudinaryUrl = currentValue.includes("cloudinary.com");

        return (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel>{label}</FieldLabel>
            <FieldContent>
              <div className="space-y-4">
                {/* Current Image Display */}
                <div className="relative group">
                  <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                    {isCloudinaryUrl ? (
                      <CldImage
                        src={currentValue}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality="auto"
                      />
                    ) : (
                      <Image
                        src={currentValue}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        width={500}
                        height={300}
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(currentValue, "_blank")}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!isDefaultImage && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(field.onChange)}
                          disabled={disabled || deleting}
                        >
                          {deleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                {uploadInfo && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <div className="grid grid-cols-2 gap-2">
                      <span>
                        Size: {(uploadInfo.size / 1024).toFixed(1)} KB
                      </span>
                      <span>Format: {uploadInfo.format.toUpperCase()}</span>
                      <span>
                        Dimensions: {uploadInfo.width}×{uploadInfo.height}
                      </span>
                      <span>CDN: Cloudinary ✓</span>
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        await uploadImage(file, field.onChange);
                      }
                    }}
                    disabled={disabled || uploading}
                    className="hidden"
                    id={`upload-${name}`}
                  />

                  <label
                    htmlFor={`upload-${name}`}
                    className={`
                      flex flex-col items-center justify-center w-full h-32 
                      border-2 border-dashed border-gray-300 rounded-lg 
                      cursor-pointer bg-gray-50 hover:bg-gray-100 
                      dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600
                      transition-colors
                      ${
                        disabled || uploading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    `}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-gray-500" />
                      ) : (
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      )}
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          {uploading
                            ? "Uploading to Cloudinary..."
                            : "Click to upload"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, WebP (MAX. 1MB)
                      </p>
                      <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                        Auto-optimized • Global CDN • WebP conversion
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
              <FieldError errors={fieldState.error ? [fieldState.error] : []} />
            </FieldContent>
          </Field>
        );
      }}
    />
  );
};

export default ImageUpload;
