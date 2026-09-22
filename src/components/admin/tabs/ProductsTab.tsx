"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Star,
  Tag,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { AdminProduct, ProductModal } from "../modals/ProductModal";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";

interface ProductsTabProps {
  products: AdminProduct[];
  onProductsUpdated: (products: AdminProduct[]) => void;
}

export function ProductsTab({
  products,
  onProductsUpdated,
}: ProductsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [showArchived, setShowArchived] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);

  const [deleteProduct, setDeleteProduct] = useState<AdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Counts
  const archivedCount = useMemo(
    () => products.filter((p) => p.archived).length,
    [products]
  );
  const activeCount = useMemo(
    () => products.filter((p) => !p.archived).length,
    [products]
  );

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => cats.add(p.category));
    return Array.from(cats);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Archive filter
      if (showArchived) {
        if (!p.archived) return false;
      } else {
        if (p.archived) return false;
      }

      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, showArchived, searchTerm, selectedCategory]);

  // Handle Save (Create / Update)
  const handleSaved = (savedProduct: AdminProduct) => {
    const exists = products.some((p) => p.id === savedProduct.id);
    let updated: AdminProduct[];
    if (exists) {
      updated = products.map((p) => (p.id === savedProduct.id ? savedProduct : p));
    } else {
      updated = [savedProduct, ...products];
    }
    onProductsUpdated(updated);
  };

  // Handle Archive Toggle
  const handleToggleArchive = async (product: AdminProduct) => {
    setUpdatingId(product.id);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: !product.archived }),
      });

      if (res.ok) {
        const updated = await res.json();
        onProductsUpdated(products.map((p) => (p.id === product.id ? { ...p, ...updated } : p)));
      }
    } catch (err) {
      console.error("Toggle archive product error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteProduct) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${deleteProduct.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Delete failed");
        setIsDeleting(false);
        return;
      }

      onProductsUpdated(products.filter((p) => p.id !== deleteProduct.id));
      setDeleteProduct(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Archive Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-h5 font-semibold text-white">
            Products Catalog
          </h3>
          <p className="text-xs text-navy-300 mt-0.5">
            {activeCount} active items · {archivedCount} archived
          </p>
        </div>

        {/* Top Actions: Archive Toggle & Add Product Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowArchived((prev) => !prev)}
            className={`flex items-center gap-2 h-10 px-3 rounded-base border text-xs font-medium transition-colors cursor-pointer ${
              showArchived
                ? "border-gold-500/60 bg-gold-500/15 text-gold-300"
                : "border-navy-700 bg-navy-900 text-navy-300 hover:text-white hover:border-navy-600"
            }`}
          >
            {showArchived ? (
              <>
                <ArchiveRestore className="h-3.5 w-3.5 text-gold-400" />
                <span>Showing Archived ({archivedCount})</span>
              </>
            ) : (
              <>
                <Archive className="h-3.5 w-3.5 text-navy-400" />
                <span>Show Archived ({archivedCount})</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-base bg-gold-500 text-xs font-semibold text-navy-950 hover:bg-gold-400 transition-colors shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Action Bar / Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name, slug..."
            className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 pl-10 pr-4 text-xs text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 px-3 text-xs text-navy-200 focus:border-gold-400 focus:outline-none"
          >
            <option value="ALL">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Datatable Card */}
      <div className="rounded-xl border border-navy-800 bg-navy-900/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-navy-800 bg-navy-950/60 text-[11px] font-semibold uppercase tracking-wider text-navy-300">
                <th className="py-3.5 px-4">Item & Visual</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 text-xs text-navy-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-navy-400">
                    {showArchived
                      ? "No archived products found."
                      : "No products found matching your search or filters."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-navy-800/40 transition-colors ${
                      product.archived ? "opacity-75 bg-navy-950/40" : ""
                    }`}
                  >
                    {/* Item & Visual */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-navy-950 border border-navy-800 flex items-center justify-center text-gold-400">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <Package className="h-5 w-5 opacity-60" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-white truncate text-small">
                              {product.name}
                            </p>
                            {product.archived && (
                              <span className="px-1.5 py-0.2 rounded bg-navy-800 border border-navy-700 text-[9px] font-medium text-navy-300 uppercase">
                                Archived
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-navy-400 font-mono truncate">
                            /{product.slug}
                          </p>
                          {product.subtitle && (
                            <p className="text-[11px] text-gold-400/80 truncate mt-0.5">
                              {product.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy-950 border border-navy-800 text-[11px] text-navy-200">
                        <Tag className="h-2.5 w-2.5 text-gold-400" />
                        <span>{product.category}</span>
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono font-medium text-white">
                      {product.price !== null ? (
                        <span className="text-gold-400">₹{product.price.toLocaleString("en-IN")}</span>
                      ) : (
                        <span className="text-navy-400 text-xs italic">On Request</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {product.enabled ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-medium text-emerald-400">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy-950 border border-navy-800 text-[10px] font-medium text-navy-400">
                            <XCircle className="h-2.5 w-2.5" />
                            <span>Draft</span>
                          </span>
                        )}

                        {product.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-[10px] font-medium text-amber-300">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-base border border-navy-700 bg-navy-950 text-xs font-medium text-navy-200 hover:border-gold-400/40 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3 text-gold-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          title={product.archived ? "Unarchive Product" : "Archive Product"}
                          disabled={updatingId === product.id}
                          onClick={() => handleToggleArchive(product)}
                          className="p-1.5 rounded-base border border-navy-700 bg-navy-950 text-navy-300 hover:text-gold-300 hover:border-gold-500/40 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {product.archived ? (
                            <ArchiveRestore className="h-3.5 w-3.5 text-gold-400" />
                          ) : (
                            <Archive className="h-3.5 w-3.5 text-navy-400" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteProduct(product)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-base border border-rose-500/20 bg-rose-950/20 text-xs font-medium text-rose-300 hover:border-rose-500/40 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-navy-800 bg-navy-950/60 text-xs text-navy-400 flex items-center justify-between">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>
          <span className="font-mono text-[11px] text-navy-500">
            Realtime DB CRUD Active
          </span>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteProduct}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${deleteProduct?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteProduct(null)}
      />
    </div>
  );
}

