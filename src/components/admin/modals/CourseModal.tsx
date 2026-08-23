"use client";

import { useState, useEffect } from "react";
import { X, Loader2, BookOpen, AlertCircle } from "lucide-react";
import { FileUploadInput } from "../FileUploadInput";

export interface AdminCourse {
  id: string;
  slug: string;
  title: string;
  category?: string | null;
  image: string;
  price: number | null;
  originalPrice?: number | null;
  shortDescription: string;
  enrollHref: string;
  enabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface CourseModalProps {
  isOpen: boolean;
  course: AdminCourse | null;
  onClose: () => void;
  onSaved: (course: AdminCourse) => void;
}

const COURSE_CATEGORIES = [
  "Numerology",
  "Astrology",
  "Remedies",
  "Switchword",
  "Occult Sciences",
];

export function CourseModal({
  isOpen,
  course,
  onClose,
  onSaved,
}: CourseModalProps) {
  const isEdit = !!course;

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    category: COURSE_CATEGORIES[0],
    image: "/images/services/course.jpg",
    price: "",
    originalPrice: "",
    shortDescription: "",
    enrollHref: "/book-consultation",
    enabled: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        slug: course.slug,
        title: course.title,
        category: course.category || COURSE_CATEGORIES[0],
        image: course.image,
        price: course.price !== null ? String(course.price) : "",
        originalPrice: course.originalPrice !== null && course.originalPrice !== undefined ? String(course.originalPrice) : "",
        shortDescription: course.shortDescription,
        enrollHref: course.enrollHref || "/book-consultation",
        enabled: course.enabled,
      });
    } else {
      setFormData({
        slug: "",
        title: "",
        category: COURSE_CATEGORIES[0],
        image: "/images/services/mobile-numerology-course.jpg",
        price: "",
        originalPrice: "",
        shortDescription: "",
        enrollHref: "/book-consultation",
        enabled: true,
      });
    }
    setError(null);
  }, [course, isOpen]);

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !isEdit && (!prev.slug || prev.slug === generateSlug(prev.title)) ? generateSlug(title) : prev.slug,
    }));
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Course Title is required.");
      return;
    }
    if (!formData.slug.trim()) {
      setError("Slug is required.");
      return;
    }
    if (!formData.shortDescription.trim()) {
      setError("Short description is required.");
      return;
    }
    if (!formData.image.trim()) {
      setError("Course image is required.");
      return;
    }

    const payload = {
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      category: formData.category,
      image: formData.image.trim(),
      price: formData.price ? parseInt(formData.price, 10) : null,
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice, 10) : null,
      shortDescription: formData.shortDescription.trim(),
      enrollHref: formData.enrollHref.trim() || "/book-consultation",
      enabled: formData.enabled,
    };

    setIsSubmitting(true);

    try {
      const url = isEdit
        ? `/api/admin/courses/${course.id}`
        : `/api/admin/courses`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save course.");
        setIsSubmitting(false);
        return;
      }

      onSaved(data);
      onClose();
    } catch (err) {
      console.error("Save course error:", err);
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
              <BookOpen className="h-4 w-4" />
            </div>
            <h2 className="font-heading text-h5 font-semibold text-white">
              {isEdit ? "Edit Course" : "Add New Course"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-base p-1 text-navy-400 hover:text-white hover:bg-navy-800 transition-colors"
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
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                Course Title <span className="text-gold-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Mobile Numerology Mastery"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                Slug (URL Identifier) <span className="text-gold-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. mobile-numerology-mastery"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Image */}
          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-navy-200 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white focus:border-gold-400 focus:outline-none"
            >
              {COURSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Course Banner Image Upload */}
          <FileUploadInput
            label="Course Banner Image"
            required
            currentValue={formData.image}
            onChange={(newPath) => setFormData({ ...formData, image: newPath })}
            uploadType="image"
            uploadFolder="images/courses"
            helperText="Uploaded to public/images/courses"
          />

          {/* Price & Original Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                Offer Price (INR ₹ — leave empty for Price on request)
              </label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 4999"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                Original Strike Price (INR ₹ — Optional)
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="e.g. 7999"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-medium text-navy-200 mb-1">
              Short Description & Curriculum Summary <span className="text-gold-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="What students will learn in this certification course..."
              className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Enroll Href */}
          <div>
            <label className="block text-xs font-medium text-navy-200 mb-1">
              Enrollment Call-to-Action Link
            </label>
            <input
              type="text"
              value={formData.enrollHref}
              onChange={(e) => setFormData({ ...formData, enrollHref: e.target.value })}
              placeholder="/book-consultation"
              className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Toggle Enabled */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-navy-700 bg-navy-950 text-gold-500 focus:ring-gold-400/40"
              />
              <span className="text-small text-white">Active / Open for Enrollment</span>
            </label>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-navy-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-base border border-navy-700 bg-navy-950 px-4 py-2 text-small font-medium text-navy-200 hover:text-white transition-colors"
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
                <span>{isEdit ? "Update Course" : "Create Course"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
