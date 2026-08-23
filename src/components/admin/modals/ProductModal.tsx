"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { FileUploadInput } from "../FileUploadInput";

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  subtitle?: string | null;
  benefits?: string[] | null;
  price: number | null;
  image: string | null;
  icon: string;
  featured: boolean;
  enabled: boolean;
  href: string | null;
  variantsNote?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface ProductModalProps {
  isOpen: boolean;
  product: AdminProduct | null; // null for Create mode, product for Edit mode
  onClose: () => void;
  onSaved: (product: AdminProduct) => void;
}

const CATEGORIES = [
  "Crystals & Gemstones",
  "Rudraksha Mala",
  "Bracelets & Malas",
  "Pyramids & Vastu",
  "Yantras & Sacred Geometry",
  "Spiritual Decor",
];

const ICONS = ["sparkles", "gem", "book", "triangle"];

export function ProductModal({
  isOpen,
  product,
  onClose,
  onSaved,
}: ProductModalProps) {
  const isEdit = !!product;

  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    category: CATEGORIES[0],
    shortDescription: "",
    subtitle: "",
    benefitsText: "",
    price: "930",
    image: "",
    icon: "sparkles",
    featured: false,
    enabled: true,
    href: "/shop",
    variantsNote: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        slug: product.slug,
        name: product.name,
        category: product.category,
        shortDescription: product.shortDescription,
        subtitle: product.subtitle || "",
        benefitsText: Array.isArray(product.benefits) ? product.benefits.join("\n") : "",
        price: product.price !== null ? String(product.price) : "",
        image: product.image || "",
        icon: product.icon || "sparkles",
        featured: product.featured,
        enabled: product.enabled,
        href: product.href || "/shop",
        variantsNote: product.variantsNote || "",
      });
    } else {
      setFormData({
        slug: "",
        name: "",
        category: CATEGORIES[0],
        shortDescription: "",
        subtitle: "",
        benefitsText: "",
        price: "930",
        image: "",
        icon: "sparkles",
        featured: false,
        enabled: true,
        href: "/shop",
        variantsNote: "",
      });
    }
    setError(null);
  }, [product, isOpen]);

  // Auto-generate slug from name if slug is empty
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
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Product Name is required.");
      return;
    }
    if (!formData.slug.trim()) {
      setError("Slug is required.");
      return;
    }
    if (!formData.shortDescription.trim()) {
      setError("Short Description is required.");
      return;
    }

    const benefitsArray = formData.benefitsText
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);

    const payload = {
      slug: formData.slug.trim(),
      name: formData.name.trim(),
      category: formData.category,
      shortDescription: formData.shortDescription.trim(),
      subtitle: formData.subtitle.trim() || null,
      benefits: benefitsArray.length > 0 ? benefitsArray : null,
      price: formData.price ? parseInt(formData.price, 10) : null,
      image: formData.image.trim() || null,
      icon: formData.icon,
      featured: formData.featured,
      enabled: formData.enabled,
      href: formData.href.trim() || "/shop",
      variantsNote: formData.variantsNote.trim() || null,
    };

    setIsSubmitting(true);

    try {
      const url = isEdit
        ? `/api/admin/products/${product.id}`
        : `/api/admin/products`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save product.");
        setIsSubmitting(false);
        return;
      }

      onSaved(data);
      onClose();
    } catch (err) {
      console.error("Save product error:", err);
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
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="font-heading text-h5 font-semibold text-white">
              {isEdit ? "Edit Product" : "Add New Product"}
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
                Product Name <span className="text-gold-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Prehnite Diamond Cut Bracelet"
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
                placeholder="e.g. prehnite-bracelet"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white focus:border-gold-400 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
                placeholder="e.g. 930"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Subtitle & Image */}
          {/* Subtitle */}
          <div>
            <label className="block text-xs font-medium text-navy-200 mb-1">
              Subtitle / Tagline (Optional)
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Stone of Inner Peace"
              className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Product Image Upload */}
          <FileUploadInput
            label="Product Image"
            currentValue={formData.image}
            onChange={(newPath) => setFormData({ ...formData, image: newPath })}
            uploadType="image"
            uploadFolder="images/products"
            helperText="Uploaded to public/images/products"
          />

          {/* Short Description */}
          <div>
            <label className="block text-xs font-medium text-navy-200 mb-1">
              Short Description <span className="text-gold-400">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="A brief overview of the product's spiritual energies and benefits..."
              className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Key Benefits (1 per line) */}
          <div>
            <label className="block text-xs font-medium text-navy-200 mb-1">
              Key Benefits (One benefit per line)
            </label>
            <textarea
              rows={3}
              value={formData.benefitsText}
              onChange={(e) => setFormData({ ...formData, benefitsText: e.target.value })}
              placeholder="Emotional Healing&#10;Inner Peace & Calm&#10;Divine Spiritual Connection"
              className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none font-mono text-xs"
            />
          </div>

          {/* Variants Note & Icon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                Variants Note (Optional Badge)
              </label>
              <input
                type="text"
                value={formData.variantsNote}
                onChange={(e) => setFormData({ ...formData, variantsNote: e.target.value })}
                placeholder="e.g. Available in 1 to 14 Mukhis"
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-200 mb-1">
                Icon Type
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full rounded-base border border-navy-700 bg-navy-950 px-3.5 py-2 text-small text-white focus:border-gold-400 focus:outline-none"
              >
                {ICONS.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggles: Featured & Enabled */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-navy-700 bg-navy-950 text-gold-500 focus:ring-gold-400/40"
              />
              <span className="text-small text-white">Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="h-4 w-4 rounded border-navy-700 bg-navy-950 text-gold-500 focus:ring-gold-400/40"
              />
              <span className="text-small text-white">Active / Published</span>
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
                <span>{isEdit ? "Update Product" : "Create Product"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
