"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Archive,
  ArchiveRestore,
  ChevronUp,
  ChevronDown,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Layers,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { AdminService, ServiceModal } from "../modals/ServiceModal";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";
import { formatPrice } from "@/data/services";

interface ServicesTabProps {
  services: AdminService[];
  onServicesUpdated: (services: AdminService[]) => void;
}

export function ServicesTab({ services, onServicesUpdated }: ServicesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "featured" | "archived">("all");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<AdminService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Categories list derived from services
  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set).sort();
  }, [services]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      // Archive filter
      if (statusFilter === "archived") {
        if (!s.archived) return false;
      } else {
        if (s.archived) return false; // hide archived by default
        if (statusFilter === "active" && !s.enabled) return false;
        if (statusFilter === "inactive" && s.enabled) return false;
        if (statusFilter === "featured" && !s.featured) return false;
      }

      // Category filter
      if (categoryFilter !== "all" && s.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const nameMatch = s.name.toLowerCase().includes(q);
        const descMatch = s.shortDescription.toLowerCase().includes(q);
        const slugMatch = s.slug.toLowerCase().includes(q);
        const catMatch = s.category.toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !slugMatch && !catMatch) return false;
      }

      return true;
    });
  }, [services, statusFilter, categoryFilter, searchQuery]);

  // Statistics
  const totalCount = services.filter((s) => !s.archived).length;
  const activeCount = services.filter((s) => !s.archived && s.enabled).length;
  const featuredCount = services.filter((s) => !s.archived && s.featured).length;
  const archivedCount = services.filter((s) => s.archived).length;

  const handleOpenAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: AdminService) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleSaved = (savedService: AdminService) => {
    if (editingService) {
      onServicesUpdated(
        services.map((s) => (s.id === savedService.id ? savedService : s))
      );
    } else {
      onServicesUpdated([...services, savedService]);
    }
  };

  const handleToggleEnabled = async (service: AdminService) => {
    const newStatus = !service.enabled;
    // Optimistic update
    onServicesUpdated(
      services.map((s) => (s.id === service.id ? { ...s, enabled: newStatus } : s))
    );

    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update service status");
      const updated = await res.json();
      onServicesUpdated(services.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err: any) {
      // Revert on error
      onServicesUpdated(
        services.map((s) => (s.id === service.id ? { ...s, enabled: !newStatus } : s))
      );
      setActionError(err?.message || "Failed to update service");
      setTimeout(() => setActionError(null), 4000);
    }
  };

  const handleToggleFeatured = async (service: AdminService) => {
    const newFeatured = !service.featured;
    // Optimistic update
    onServicesUpdated(
      services.map((s) => (s.id === service.id ? { ...s, featured: newFeatured } : s))
    );

    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newFeatured }),
      });
      if (!res.ok) throw new Error("Failed to update featured flag");
      const updated = await res.json();
      onServicesUpdated(services.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err: any) {
      // Revert on error
      onServicesUpdated(
        services.map((s) => (s.id === service.id ? { ...s, featured: !newFeatured } : s))
      );
      setActionError(err?.message || "Failed to update featured flag");
      setTimeout(() => setActionError(null), 4000);
    }
  };

  const handleToggleArchive = async (service: AdminService) => {
    const newArchived = !service.archived;
    // Optimistic update
    onServicesUpdated(
      services.map((s) => (s.id === service.id ? { ...s, archived: newArchived } : s))
    );

    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: newArchived }),
      });
      if (!res.ok) throw new Error("Failed to update archive status");
      const updated = await res.json();
      onServicesUpdated(services.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err: any) {
      onServicesUpdated(
        services.map((s) => (s.id === service.id ? { ...s, archived: !newArchived } : s))
      );
      setActionError(err?.message || "Failed to update archive status");
      setTimeout(() => setActionError(null), 4000);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (isReordering) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredServices.length) return;

    const currentItem = filteredServices[index];
    const targetItem = filteredServices[targetIndex];

    const currentOrder = currentItem.displayOrder ?? index;
    const targetOrder = targetItem.displayOrder ?? targetIndex;

    // Swap in local array
    const updatedServices = [...services];
    const idx1 = updatedServices.findIndex((s) => s.id === currentItem.id);
    const idx2 = updatedServices.findIndex((s) => s.id === targetItem.id);

    if (idx1 !== -1 && idx2 !== -1) {
      updatedServices[idx1] = { ...currentItem, displayOrder: targetOrder };
      updatedServices[idx2] = { ...targetItem, displayOrder: currentOrder };
      updatedServices.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      onServicesUpdated(updatedServices);
    }

    setIsReordering(true);
    try {
      await fetch("/api/admin/services/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            { id: currentItem.id, displayOrder: targetOrder },
            { id: targetItem.id, displayOrder: currentOrder },
          ],
        }),
      });
    } catch (err) {
      console.error("Failed to reorder services:", err);
    } finally {
      setIsReordering(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/services/${serviceToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete service");
      }

      onServicesUpdated(services.filter((s) => s.id !== serviceToDelete.id));
      setServiceToDelete(null);
    } catch (err: any) {
      setActionError(err?.message || "Failed to delete service");
      setServiceToDelete(null);
      setTimeout(() => setActionError(null), 4000);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-gold-400" />
            Services & Consultations
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage consultations, name analysis, numerology, astrology, and remedial services.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold transition-all shadow-md active:scale-95 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {actionError && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          {actionError}
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-navy-800 bg-navy-900/60 p-4">
          <span className="text-xs text-gray-400 block font-medium">Total Services</span>
          <span className="text-2xl font-bold text-white mt-1 block">{totalCount}</span>
        </div>
        <div className="rounded-xl border border-navy-800 bg-navy-900/60 p-4">
          <span className="text-xs text-emerald-400 block font-medium">Active / Published</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">{activeCount}</span>
        </div>
        <div className="rounded-xl border border-navy-800 bg-navy-900/60 p-4">
          <span className="text-xs text-gold-400 block font-medium">Featured (Homepage)</span>
          <span className="text-2xl font-bold text-gold-400 mt-1 block">{featuredCount}</span>
        </div>
        <div className="rounded-xl border border-navy-800 bg-navy-900/60 p-4">
          <span className="text-xs text-gray-500 block font-medium">Archived</span>
          <span className="text-2xl font-bold text-gray-400 mt-1 block">{archivedCount}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-navy-900/40 p-3 rounded-xl border border-navy-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services by title, description or slug..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-navy-700 bg-navy-950 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-navy-700 bg-navy-950 text-sm text-white focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-navy-700 bg-navy-950 text-sm text-white focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Non-Archived</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="featured">Featured Only</option>
            <option value="archived">Archived ({archivedCount})</option>
          </select>
        </div>
      </div>

      {/* Services List Table */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-navy-800 bg-navy-900/30">
          <Sparkles className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <p className="text-base font-medium text-gray-300">No services found</p>
          <p className="text-xs text-gray-500 mt-1">
            {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters or search keywords"
              : "Click 'Add Service' to create your first consultation offering"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy-800 bg-navy-900/60 shadow-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-800 bg-navy-950/70 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="py-3.5 px-4 w-16 text-center">Order</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filteredServices.map((service, idx) => (
                <tr
                  key={service.id}
                  className="hover:bg-navy-800/40 transition-colors group"
                >
                  {/* Order & Move Arrows */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0 || isReordering}
                        title="Move Up"
                        className="p-1 rounded hover:bg-navy-800 text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-mono text-gray-400 w-4 text-center">
                        {service.displayOrder ?? idx}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === filteredServices.length - 1 || isReordering}
                        title="Move Down"
                        className="p-1 rounded hover:bg-navy-800 text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Service Info (Thumbnail + Name + Short Desc) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-navy-700 bg-navy-950 flex items-center justify-center">
                        {service.image ? (
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <Sparkles className="h-5 w-5 text-gold-400/50" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-semibold text-white truncate max-w-sm">
                            {service.name}
                          </span>
                          {service.durationMinutes && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-navy-800 text-gray-300">
                              <Clock className="h-2.5 w-2.5" />
                              {service.durationMinutes}m
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate max-w-md mt-0.5">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gold-500/10 border border-gold-500/20 text-gold-300 whitespace-nowrap">
                      {service.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-gray-300">
                      {service.price ? formatPrice(service.price) : "Price on request"}
                    </span>
                  </td>

                  {/* Featured on Homepage Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(service)}
                      title={service.featured ? "Remove from Homepage" : "Feature on Homepage"}
                      className={`p-1.5 rounded-lg border transition-all ${
                        service.featured
                          ? "bg-gold-500/15 border-gold-500/40 text-gold-400 hover:bg-gold-500/25"
                          : "bg-navy-950/60 border-navy-800 text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <Star className={`h-4 w-4 ${service.featured ? "fill-gold-400" : ""}`} />
                    </button>
                  </td>

                  {/* Active / Enabled Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleEnabled(service)}
                      title={service.enabled ? "Disable Service" : "Enable Service"}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                        service.enabled
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-rose-500/15 border-rose-500/40 text-rose-400 hover:bg-rose-500/25"
                      }`}
                    >
                      {service.enabled ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Disabled
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions (Edit, Archive, Delete) */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(service)}
                        title="Edit Service"
                        className="p-1.5 rounded-md hover:bg-navy-800 text-gray-400 hover:text-gold-400 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleArchive(service)}
                        title={service.archived ? "Restore Service" : "Archive Service"}
                        className="p-1.5 rounded-md hover:bg-navy-800 text-gray-400 hover:text-amber-400 transition-colors"
                      >
                        {service.archived ? (
                          <ArchiveRestore className="h-4 w-4 text-amber-400" />
                        ) : (
                          <Archive className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setServiceToDelete(service)}
                        title="Delete Service"
                        className="p-1.5 rounded-md hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Service Create / Edit Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        service={editingService}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <DeleteConfirmModal
          isOpen={true}
          title={`Delete "${serviceToDelete.name}"?`}
          message={`Are you sure you want to permanently delete "${serviceToDelete.name}"? This action cannot be undone.`}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setServiceToDelete(null)}
        />
      )}
    </div>
  );
}
