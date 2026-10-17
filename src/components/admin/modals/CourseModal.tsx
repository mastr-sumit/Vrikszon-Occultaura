"use client";

import { useState, useEffect } from "react";
import { X, Loader2, BookOpen, AlertCircle, Plus, Check, Video, Calendar } from "lucide-react";
import { FileUploadInput } from "../FileUploadInput";

export interface AdminCourse {
  id: string;
  slug: string;
  title: string;
  category?: string | null;
  image: string;
  price: number | null;
  originalPrice?: number | null;
  livePrice?: number | null;
  liveOriginalPrice?: number | null;
  nextBatch?: string | null;
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

const DEFAULT_COURSE_CATEGORIES = [
  "Numerology",
  "Astrology",
  "Remedies",
  "Switchword",
];

export function CourseModal({
  isOpen,
  course,
  onClose,
  onSaved,
}: CourseModalProps) {
  const isEdit = !!course;

  const [categoriesList, setCategoriesList] = useState<string[]>(DEFAULT_COURSE_CATEGORIES);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryCreateError, setCategoryCreateError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    category: DEFAULT_COURSE_CATEGORIES[0],
    image: "/images/courses/basic-vastu.jpg",
    price: "",
    originalPrice: "",
    livePrice: "",
    liveOriginalPrice: "",
    nextBatch: "",
    shortDescription: "",
    enrollHref: "/book-consultation",
    enabled: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories?type=COURSE");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const names = data.map((c: any) => c.name);
            setCategoriesList(names);
          }
        }
      } catch (err) {
        console.error("Failed to fetch course categories:", err);
      }
    }

    if (isOpen) {
      loadCategories();
      setIsAddingNewCategory(false);
      setNewCategoryInput("");
      setCategoryCreateError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (course) {
      setFormData({
        slug: course.slug,
        title: course.title,
        category: course.category || categoriesList[0] || DEFAULT_COURSE_CATEGORIES[0],
        image: course.image,
        price: course.price !== null && course.price !== undefined ? String(course.price) : "",
        originalPrice: course.originalPrice !== null && course.originalPrice !== undefined ? String(course.originalPrice) : "",
        livePrice: course.livePrice !== null && course.livePrice !== undefined ? String(course.livePrice) : "",
        liveOriginalPrice: course.liveOriginalPrice !== null && course.liveOriginalPrice !== undefined ? String(course.liveOriginalPrice) : "",
        nextBatch: course.nextBatch || "",
        shortDescription: course.shortDescription,
        enrollHref: course.enrollHref || "/book-consultation",
        enabled: course.enabled,
      });
    } else {
      setFormData({
        slug: "",
        title: "",
        category: categoriesList[0] || DEFAULT_COURSE_CATEGORIES[0],
        image: "/images/services/mobile-numerology-course.jpg",
        price: "",
        originalPrice: "",
        livePrice: "",
        liveOriginalPrice: "",
        nextBatch: "",
        shortDescription: "",
        enrollHref: "/book-consultation",
        enabled: true,
      });
    }
    setError(null);
    setIsSubmitting(false);
  }, [course, isOpen, categoriesList]);

  const handleQuickAddCategory = async () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed || trimmed.length < 2) {
      setCategoryCreateError("Category name must be at least 2 characters");
      return;
    }

    setIsCreatingCategory(true);
    setCategoryCreateError(null);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, type: "COURSE" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");

      setCategoriesList((prev) => (prev.includes(data.name) ? prev : [data.name, ...prev]));
      setFormData((prev) => ({ ...prev, category: data.name }));
      setIsAddingNewCategory(false);
      setNewCategoryInput("");
    } catch (err: any) {
      setCategoryCreateError(err?.message || "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

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
      livePrice: formData.livePrice ? parseInt(formData.livePrice, 10) : null,
      liveOriginalPrice: formData.liveOriginalPrice ? parseInt(formData.liveOriginalPrice, 10) : null,
      nextBatch: formData.nextBatch.trim() ? formData.nextBatch.trim() : null,
      shortDescription: formData.shortDescription.trim(),
      enrollHref: formData.enrollHref.trim() || "/book-consultation",
      enabled: formData.enabled,
    };

    setIsSubmitting(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const url = isEdit
        ? `/api/admin/courses/${course.id}`
        : `/api/admin/courses`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to save course.");
        return;
      }

      onSaved(data);
      onClose();
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Save course error:", err);
      if (err?.name === "AbortError") {
        setError("Request timed out (15s). Please check connection and try again.");
      } else {
        setError(err?.message || "An unexpected network error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl border border-navy-700/60 bg-navy-900 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-body font-semibold text-white">
                {isEdit ? "Edit Course" : "Add New Course"}
              </h2>
              <p className="text-[11px] text-navy-400">
                Configure certification details, live/recorded pricing, and batch dates
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-base p-1 text-navy-400 hover:bg-navy-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-base border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                placeholder="e.g. Master Vastu Shastra"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                URL Slug <span className="text-gold-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. master-vastu-shastra"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-navy-200">
                Discipline / Category
              </label>
              {!isAddingNewCategory && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewCategory(true)}
                  className="text-[11px] text-gold-400 hover:text-gold-300 flex items-center gap-1 font-medium"
                >
                  <Plus className="h-3 w-3" />
                  <span>New Category</span>
                </button>
              )}
            </div>

            {isAddingNewCategory ? (
              <div className="space-y-2 p-3 rounded-lg border border-gold-500/30 bg-navy-950">
                <p className="text-[11px] text-gold-300 font-medium">Create and link new category:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={isCreatingCategory}
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="e.g. Tarot Mastery"
                    className="flex-1 rounded border border-navy-700 bg-navy-900 px-3 py-1.5 text-xs text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isCreatingCategory}
                    onClick={handleQuickAddCategory}
                    className="px-2.5 py-1 rounded bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs flex items-center gap-1 disabled:opacity-50"
                  >
                    {isCreatingCategory ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                    Add
                  </button>
                  <button
                    type="button"
                    disabled={isCreatingCategory}
                    onClick={() => setIsAddingNewCategory(false)}
                    className="px-2 py-1 rounded bg-navy-800 hover:bg-navy-700 text-gray-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
                {categoryCreateError && (
                  <p className="text-[10px] text-rose-400">{categoryCreateError}</p>
                )}
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white focus:border-gold-400 focus:outline-none"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                {formData.category && !categoriesList.includes(formData.category) && (
                  <option value={formData.category}>{formData.category}</option>
                )}
              </select>
            )}
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

          {/* Pricing Controls: Recorded Mode & Live Mode */}
          <div className="space-y-4 pt-1">
            {/* 1. Recorded Mode Pricing */}
            <div className="rounded-xl border border-navy-800 bg-navy-950/70 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-navy-800/80">
                <Video className="h-4 w-4 text-gold-400" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Recorded Mode Pricing
                </span>
                <span className="text-[10px] text-navy-400 ml-auto">Self-Paced Learning</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-navy-200 mb-1">
                    Recorded Offer Price (INR ₹ — leave empty for Price on request)
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
                    Recorded Original Strike Price (INR ₹ — Optional)
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
            </div>

            {/* 2. Live Mode Pricing & Batch */}
            <div className="rounded-xl border border-emerald-900/40 bg-navy-950/70 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-navy-800/80">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Live Masterclass Pricing &amp; Batch
                </span>
                <span className="text-[10px] text-emerald-400/80 ml-auto">Interactive Cohort</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-xs font-medium text-navy-200 mb-1">
                    Live Offer Price (INR ₹ — leave empty to match Recorded)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.livePrice}
                    onChange={(e) => setFormData({ ...formData, livePrice: e.target.value })}
                    placeholder="e.g. 6999"
                    className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-200 mb-1">
                    Live Original Strike Price (INR ₹ — Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.liveOriginalPrice}
                    onChange={(e) => setFormData({ ...formData, liveOriginalPrice: e.target.value })}
                    placeholder="e.g. 9999"
                    className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-navy-200 mb-1 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gold-400" />
                  <span>Upcoming Live Batch Schedule (Optional — shown exclusively on Live tab)</span>
                </label>
                <input
                  type="text"
                  value={formData.nextBatch}
                  onChange={(e) => setFormData({ ...formData, nextBatch: e.target.value })}
                  placeholder="e.g. Upcoming Batch: Starts 15th of Next Month"
                  className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
                />
              </div>
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
                <span>{isEdit ? "Update Course" : "Create Course"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
