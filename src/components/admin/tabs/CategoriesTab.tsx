"use client";

import { useState, useEffect } from "react";
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  Package,
  GraduationCap,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  type: "PRODUCT" | "COURSE" | "SERVICE";
  productCount: number;
  courseCount: number;
  serviceCount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface CategoriesTabProps {
  onRefreshParent?: () => void;
}

export function CategoriesTab({ onRefreshParent }: CategoriesTabProps) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"PRODUCT" | "COURSE" | "SERVICE">("PRODUCT");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<"PRODUCT" | "COURSE" | "SERVICE">("PRODUCT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete modal state
  const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName("");
    setFormType(selectedType);
    setModalError(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (category: AdminCategory) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormType(category.type);
    setModalError(null);
    setIsAddEditModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formName.trim().length < 2) {
      setModalError("Category name must be at least 2 characters");
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      if (editingCategory) {
        // PUT /api/admin/categories/[id]
        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update category");

        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? { ...c, name: data.name, slug: data.slug } : c))
        );
        setSuccessMessage(`Category renamed to "${data.name}" successfully`);
      } else {
        // POST /api/admin/categories
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formName.trim(), type: formType }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create category");

        setCategories((prev) => [data, ...prev]);
        setSuccessMessage(`Category "${data.name}" created successfully`);
      }

      setIsAddEditModalOpen(false);
      if (onRefreshParent) onRefreshParent();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setModalError(err?.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");

      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setSuccessMessage(`Category "${categoryToDelete.name}" deleted successfully`);
      setCategoryToDelete(null);
      if (onRefreshParent) onRefreshParent();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err?.message || "Failed to delete category");
      setCategoryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const matchesType = c.type === selectedType;
    const matchesSearch =
      searchQuery.trim() === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const productCatCount = categories.filter((c) => c.type === "PRODUCT").length;
  const courseCatCount = categories.filter((c) => c.type === "COURSE").length;
  const serviceCatCount = categories.filter((c) => c.type === "SERVICE").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tags className="h-6 w-6 text-gold-400" />
            Category Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage product, course, and service categories dynamically. Changes sync live across the entire website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchCategories}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-navy-700 bg-navy-800 text-gray-300 hover:text-white hover:border-gold-500/50 transition-colors text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-gold-400" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold transition-all shadow-md active:scale-95 text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div className="flex flex-wrap items-center gap-2 bg-navy-900/80 p-1 rounded-xl border border-navy-800 w-fit">
          <button
            type="button"
            onClick={() => setSelectedType("PRODUCT")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedType === "PRODUCT"
                ? "bg-gold-500 text-navy-950 shadow-md"
                : "text-gray-400 hover:text-white hover:bg-navy-800"
            }`}
          >
            <Package className="h-4 w-4" />
            Product Categories ({productCatCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("COURSE")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedType === "COURSE"
                ? "bg-gold-500 text-navy-950 shadow-md"
                : "text-gray-400 hover:text-white hover:bg-navy-800"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Course Categories ({courseCatCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("SERVICE")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedType === "SERVICE"
                ? "bg-gold-500 text-navy-950 shadow-md"
                : "text-gray-400 hover:text-white hover:bg-navy-800"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Service Categories ({serviceCatCount})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-navy-700 bg-navy-900 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Grid / List */}
      {loading && categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-gold-400 mb-3" />
          <p className="text-sm">Loading categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-navy-800 bg-navy-900/30">
          <Tags className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <p className="text-base font-medium text-gray-300">No categories found</p>
          <p className="text-xs text-gray-500 mt-1">
            {searchQuery ? "Try refining your search keyword" : `No ${selectedType.toLowerCase()} categories added yet`}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => {
            const assignedCount =
              category.type === "COURSE"
                ? category.courseCount
                : category.type === "SERVICE"
                ? (category.serviceCount ?? 0)
                : category.productCount;
            const typeLabel =
              category.type === "COURSE"
                ? "Courses"
                : category.type === "SERVICE"
                ? "Services"
                : "Products";

            return (
              <div
                key={category.id}
                className="group relative rounded-xl border border-navy-800 bg-navy-900/70 p-5 hover:border-gold-500/40 hover:bg-navy-900 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-heading text-lg font-semibold text-white group-hover:text-gold-300 transition-colors">
                      {category.name}
                    </h3>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gold-500/15 border border-gold-500/30 text-gold-400">
                      {assignedCount} {typeLabel}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-gray-400 bg-navy-950/60 px-2.5 py-1 rounded border border-navy-800/80 inline-block mb-4">
                    slug: {category.slug}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-navy-800/80 mt-2">
                  <span className="text-[11px] text-gray-500">
                    Created {new Date(category.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(category)}
                      title="Rename Category"
                      className="p-1.5 rounded-md hover:bg-navy-800 text-gray-400 hover:text-gold-400 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(category)}
                      title="Delete Category"
                      className="p-1.5 rounded-md hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-gold-500/30 bg-navy-900 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsAddEditModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Tags className="h-5 w-5 text-gold-400" />
              {editingCategory ? "Rename Category" : "Add New Category"}
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              {editingCategory
                ? `Updating this name will automatically update all assigned ${editingCategory.type.toLowerCase()}s.`
                : "Create a new category for products, courses, or services."}
            </p>

            {modalError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Sacred Yantras, Numerology..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-navy-700 bg-navy-950 text-white text-sm focus:outline-none focus:border-gold-500 placeholder:text-gray-600"
                />
              </div>

              {!editingCategory && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    Category Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-navy-700 bg-navy-950 text-white text-sm focus:outline-none focus:border-gold-500"
                  >
                    <option value="PRODUCT">Product Category</option>
                    <option value="COURSE">Course Category</option>
                    <option value="SERVICE">Service Category</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg border border-navy-700 bg-navy-800 text-gray-300 hover:text-white text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <DeleteConfirmModal
          isOpen={true}
          title={`Delete Category "${categoryToDelete.name}"?`}
          message={
            categoryToDelete.productCount > 0 ||
            categoryToDelete.courseCount > 0 ||
            (categoryToDelete.serviceCount ?? 0) > 0
              ? `Warning: This category currently has ${
                  categoryToDelete.type === "COURSE"
                    ? `${categoryToDelete.courseCount} courses`
                    : categoryToDelete.type === "SERVICE"
                    ? `${categoryToDelete.serviceCount ?? 0} services`
                    : `${categoryToDelete.productCount} products`
                } assigned. The server will reject deletion until those items are reassigned.`
              : `Are you sure you want to permanently delete "${categoryToDelete.name}"? This action cannot be undone.`
          }
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setCategoryToDelete(null)}
        />
      )}
    </div>
  );
}
