"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Video, AlertCircle } from "lucide-react";
import { FileUploadInput } from "../FileUploadInput";

export interface AdminTestimonial {
  id: string;
  clientName: string;
  clientRoleOrLocation?: string | null;
  quote?: string | null;
  videoSrc?: string | null;
  posterImage?: string | null;
  featured: boolean;
  enabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface TestimonialModalProps {
  isOpen: boolean;
  testimonial: AdminTestimonial | null;
  onClose: () => void;
  onSaved: (testimonial: AdminTestimonial) => void;
}

export function TestimonialModal({
  isOpen,
  testimonial,
  onClose,
  onSaved,
}: TestimonialModalProps) {
  const isEdit = !!testimonial;

  const [formData, setFormData] = useState({
    clientName: "",
    clientRoleOrLocation: "",
    quote: "",
    videoSrc: "",
    posterImage: "",
    featured: false,
    enabled: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setFormData({
        clientName: testimonial.clientName,
        clientRoleOrLocation: testimonial.clientRoleOrLocation || "",
        quote: testimonial.quote || "",
        videoSrc: testimonial.videoSrc || "",
        posterImage: testimonial.posterImage || "",
        featured: testimonial.featured,
        enabled: testimonial.enabled,
      });
    } else {
      setFormData({
        clientName: "",
        clientRoleOrLocation: "",
        quote: "",
        videoSrc: "",
        posterImage: "",
        featured: false,
        enabled: true,
      });
    }
    setError(null);
  }, [testimonial, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.clientName.trim()) {
      setError("Client name is required.");
      return;
    }

    const payload = {
      clientName: formData.clientName.trim(),
      clientRoleOrLocation: formData.clientRoleOrLocation.trim() || null,
      quote: formData.quote.trim() || null,
      videoSrc: formData.videoSrc.trim() || null,
      posterImage: formData.posterImage.trim() || null,
      featured: formData.featured,
      enabled: formData.enabled,
    };

    setIsSubmitting(true);

    try {
      const url = isEdit
        ? `/api/admin/testimonials/${testimonial.id}`
        : `/api/admin/testimonials`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save testimonial.");
        setIsSubmitting(false);
        return;
      }

      onSaved(data);
      onClose();
    } catch (err) {
      console.error("Save testimonial error:", err);
      setError("An unexpected network error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl border border-navy-700/60 bg-navy-900 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
              <Video className="h-4 w-4" />
            </div>
            <h2 className="font-heading text-h5 font-semibold text-white">
              {isEdit ? "Edit Testimonial" : "Add Client Testimonial"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-base p-1 text-navy-400 hover:text-white hover:bg-navy-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-base border border-rose-500/30 bg-rose-950/40 p-3 text-small text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Client Name & Role/Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                Client Name <span className="text-gold-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="e.g. Chetan, Priya S."
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                Role / Location (Optional)
              </label>
              <input
                type="text"
                value={formData.clientRoleOrLocation}
                onChange={(e) =>
                  setFormData({ ...formData, clientRoleOrLocation: e.target.value })
                }
                placeholder="e.g. Business Owner, Mumbai"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Testimonial Video File Upload */}
          <FileUploadInput
            label="Testimonial Video (MP4 / WebM — 9:16 Portrait Recommended)"
            currentValue={formData.videoSrc}
            onChange={(newPath) => setFormData({ ...formData, videoSrc: newPath })}
            uploadType="video"
            uploadFolder="videos/testimonials"
            helperText="Uploaded directly to public/videos/testimonials"
          />

          {/* Optional Poster Thumbnail Upload */}
          <FileUploadInput
            label="Custom Poster Thumbnail (Optional Image)"
            currentValue={formData.posterImage}
            onChange={(newPath) => setFormData({ ...formData, posterImage: newPath })}
            uploadType="image"
            uploadFolder="images/testimonials"
            helperText="Uploaded directly to public/images/testimonials"
          />

          {/* Written Quote (Optional) */}
          <div>
            <label className="block text-xs font-medium text-navy-200 mb-1">
              Written Quote / Summary (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="Key takeaway or highlight from the client's consultation experience..."
              className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Featured & Enabled Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-navy-700 bg-navy-950 text-gold-500 focus:ring-gold-400/40"
              />
              <span className="text-small text-white">Featured Story</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-navy-700 bg-navy-950 text-gold-500 focus:ring-gold-400/40"
              />
              <span className="text-small text-white">Active / Visible on Website</span>
            </label>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-navy-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-base border border-navy-700 bg-navy-950 px-4 py-2 text-small font-medium text-navy-200 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-base bg-gold-500 px-5 py-2 text-small font-medium text-navy-950 hover:bg-gold-400 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEdit ? "Update Testimonial" : "Create Testimonial"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
