"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImage: string | null;
  onImageChange: (url: string | null) => void;
  bucket?: string;
  folder?: string;
  aspectRatio?: string;
  label?: string;
  hint?: string;
}

export function ImageUpload({
  currentImage,
  onImageChange,
  bucket = "event-covers",
  folder = "covers",
  aspectRatio = "16/9",
  label = "Cover Image",
  hint = "Upload a photo to make your invitation stand out. JPG, PNG up to 5MB.",
}: ImageUploadProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        // If storage bucket doesn't exist yet, store as data URL for now
        console.warn("Storage upload failed, using data URL:", error.message);
        // Keep the local preview as the image
        const dataUrl = await new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = (e) => resolve(e.target?.result as string);
          r.readAsDataURL(file);
        });
        onImageChange(dataUrl);
        toast.success("Image added!");
      } else {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        onImageChange(urlData.publicUrl);
        toast.success("Image uploaded!");
      }
    } catch (err) {
      toast.error("Upload failed. Image saved locally.");
      // Keep local preview
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function removeImage() {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-charcoal mb-2">{label}</label>}

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-gold/15 shadow-sm">
          <div style={{ aspectRatio }} className="relative">
            <img
              src={preview}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur text-xs font-medium text-charcoal hover:bg-white transition-colors shadow-sm"
            >
              Change
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="px-3 py-1.5 rounded-lg bg-red-500/90 backdrop-blur text-xs font-medium text-white hover:bg-red-500 transition-colors shadow-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
            dragOver
              ? "border-burgundy bg-burgundy/5 scale-[1.01]"
              : "border-gold/30 bg-cream/50 hover:border-gold/50 hover:bg-cream"
          }`}
          style={{ aspectRatio }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            {uploading ? (
              <>
                <div className="w-10 h-10 rounded-full border-2 border-burgundy border-t-transparent animate-spin mb-3" />
                <p className="text-sm text-charcoal-light">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-burgundy/10 to-gold/10 flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-charcoal mb-1">
                  Drop your image here or <span className="text-burgundy">browse</span>
                </p>
                <p className="text-xs text-charcoal-muted">{hint}</p>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
