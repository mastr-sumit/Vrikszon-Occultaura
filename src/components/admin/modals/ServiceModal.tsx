"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Sparkles, AlertCircle, Plus, Check } from "lucide-react";
import { FileUploadInput } from "../FileUploadInput";

export interface AdminService {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryId?: string | null;
  shortDescription: string;
  longDescription?: string | null;
  price: number | null;
  durationMinutes?: number | null;
  image: string | null;
  featured: boolean;
  enabled: boolean;
  archived?: boolean;
  displayOrder?: number;
  href?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface ServiceModalProps {
  isOpen: boolean;
  service: AdminService | null; // null for Create mode, service for Edit mode
  onClose: () => void;
  onSaved: (service: AdminService) => void;
}

const DEFAULT_SERVICE_CATEGORIES = [
  "Numerology",
  "Remedies & Healing",
  "Vastu & Planetary",
  "Astrology",
  "Name & Brand",
];

export function ServiceModal({
  isOpen,
  service,
  onClose,
  onSaved,
}: ServiceModalProps) {
  const isEdit = !!service;

  const [categoriesList, setCategoriesList] = useState<string[]>(DEFAULT_SERVICE_CATEGORIES);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryCreateError, setCategoryCreateError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    category: DEFAULT_SERVICE_CATEGORIES[0],
    shortDescription: "",
    longDescription: "",
    price: "",
    durationMinutes: "",
    image: "",
    featured: false,
    enabled: true,
    href: "/services",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories?type=SERVICE");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const names = data.map((c: any) => c.name);
            setCategoriesList(names);
          }
        }
      } catch (err) {
        console.error("Failed to fetch service categories:", err);
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
    if (service) {
      setFormData({
        slug: service.slug,
        name: service.name,
        category: service.category || categoriesList[0] || DEFAULT_SERVICE_CATEGORIES[0],
        shortDescription: service.shortDescription || "",
        longDescription: service.longDescription || "",
        price: service.price !== null && service.price !== undefined ? String(service.price) : "",
        durationMinutes: service.durationMinutes !== null && service.durationMinutes !== undefined ? String(service.durationMinutes) : "",
        image: service.image || "",
        featured: service.featured,
        enabled: service.enabled,
        href: service.href || "/services",
      });
    } else {
      setFormData({
        slug: "",
        name: "",
        category: categoriesList[0] || DEFAULT_SERVICE_CATEGORIES[0],
        shortDescription: "",
        longDescription: "",
        price: "",
        durationMinutes: "",
        image: "",
        featured: false,
        enabled: true,
        href: "/services",
      });
    }
    setError(null);
    setIsSubmitting(false);
  }, [service, isOpen]);

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
        body: JSON.stringify({ name: trimmed, type: "SERVICE" }),
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

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !isEdit && (!prev.slug || prev.slug === generateSlug(prev.name)) ? generateSlug(name) : prev.slug,
    }));
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const payload = {
        slug: formData.slug.trim(),
        name: formData.name.trim(),
        category: formData.category,
        shortDescription: formData.shortDescription.trim(),
        longDescription: formData.longDescription?.trim() || null,
        price: formData.price.trim() === "" ? null : parseInt(formData.price.trim(), 10),
        durationMinutes: formData.durationMinutes.trim() === "" ? null : parseInt(formData.durationMinutes.trim(), 10),
        image: formData.image.trim() || null,
        featured: formData.featured,
        enabled: formData.enabled,
        href: formData.href.trim() || "/services",
      };

      const url = isEdit ? `/api/admin/services/${service.id}` : "/api/admin/services";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save service.");
      }

      onSaved(data);
      onClose();
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setError("Request timed out (15s). Please check your internet connection or try again.");
      } else {
        setError(err?.message || "An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl border border-navy-700/60 bg-navy-900 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="font-heading text-h5 font-semibold text-white">
              {isEdit ? "Edit Service" : "Add New Service"}
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
          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                Service Name <span className="text-gold-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Mobile Numerology Analysis"
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
                placeholder="e.g. mobile-numerology-analysis"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-navy-200">
                  Category <span className="text-gold-400">*</span>
                </label>
                {!isAddingNewCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(true);
                      setNewCategoryInput("");
                      setCategoryCreateError(null);
                    }}
                    className="text-[11px] text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    + Add New Category
                  </button>
                )}
              </div>

              {isAddingNewCategory ? (
                <div className="space-y-1.5 p-2 rounded-base border border-gold-500/30 bg-navy-950/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      placeholder="New service category name..."
                      className="flex-1 rounded border border-navy-700 bg-navy-900 px-2.5 py-1 text-xs text-white placeholder:text-gray-500 focus:border-gold-400 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleQuickAddCategory();
                        }
                      }}
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

            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                Price (INR ₹ — leave empty for Price on request)
              </label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 2100 or leave empty"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Duration (Minutes) & Session Info */}
          <div>
            <label className="block text-xs font-medium text-navy-200 mb-1">
              Consultation Duration (Minutes — Optional)
            </label>
            <input
              type="number"
              min="0"
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
              placeholder="e.g. 45 or 60"
              className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-medium text-navy-200 mb-1">
              Short Description <span className="text-gold-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Concise overview for service cards..."
              className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Service Image Upload */}
          <FileUploadInput
            label="Service Card Image / Icon"
            currentValue={formData.image}
            onChange={(newPath) => setFormData({ ...formData, image: newPath })}
            uploadType="image"
            uploadFolder="images/services"
            helperText="Uploaded to public/images/services"
          />

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3 rounded-base border border-navy-800 bg-navy-950/60 cursor-pointer hover:border-navy-700 transition-colors">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-navy-700 bg-navy-900 text-gold-500 focus:ring-gold-400"
              />
              <div>
                <span className="block text-xs font-medium text-white">Feature on Homepage</span>
                <span className="block text-[11px] text-navy-400">Highlight in the Homepage services carousel</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-base border border-navy-800 bg-navy-950/60 cursor-pointer hover:border-navy-700 transition-colors">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-navy-700 bg-navy-900 text-gold-500 focus:ring-gold-400"
              />
              <div>
                <span className="block text-xs font-medium text-white">Active / Published</span>
                <span className="block text-[11px] text-navy-400">Show publicly on website and booking forms</span>
              </div>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-base border border-navy-700 bg-navy-950 px-4 py-2 text-small font-medium text-navy-200 hover:text-white hover:border-navy-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-base bg-gold-500 px-5 py-2 text-small font-bold text-navy-950 hover:bg-gold-400 transition-colors shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Service"
              ) : (
                "Create Service"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
