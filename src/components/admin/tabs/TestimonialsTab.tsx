"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Video,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Play,
  Quote,
} from "lucide-react";
import { AdminTestimonial, TestimonialModal } from "../modals/TestimonialModal";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";

interface TestimonialsTabProps {
  testimonials: AdminTestimonial[];
  onTestimonialsUpdated: (testimonials: AdminTestimonial[]) => void;
}

export function TestimonialsTab({
  testimonials,
  onTestimonialsUpdated,
}: TestimonialsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<AdminTestimonial | null>(null);

  const [deleteTestimonial, setDeleteTestimonial] = useState<AdminTestimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered testimonials
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchesSearch =
        t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.clientRoleOrLocation &&
          t.clientRoleOrLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.quote && t.quote.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        filterStatus === "ALL" ||
        (filterStatus === "ENABLED" && t.enabled) ||
        (filterStatus === "DISABLED" && !t.enabled);

      return matchesSearch && matchesStatus;
    });
  }, [testimonials, searchTerm, filterStatus]);

  // Handle Save
  const handleSaved = (saved: AdminTestimonial) => {
    const exists = testimonials.some((t) => t.id === saved.id);
    let updated: AdminTestimonial[];
    if (exists) {
      updated = testimonials.map((t) => (t.id === saved.id ? saved : t));
    } else {
      updated = [saved, ...testimonials];
    }
    onTestimonialsUpdated(updated);
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteTestimonial) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/testimonials/${deleteTestimonial.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Delete failed");
        setIsDeleting(false);
        return;
      }

      onTestimonialsUpdated(testimonials.filter((t) => t.id !== deleteTestimonial.id));
      setDeleteTestimonial(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search testimonials by client name, quote..."
              className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 pl-10 pr-4 text-xs text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="w-44">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "ALL" | "ENABLED" | "DISABLED")}
              className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 px-3 text-xs text-navy-200 focus:border-gold-400 focus:outline-none"
            >
              <option value="ALL">All Statuses ({testimonials.length})</option>
              <option value="ENABLED">Active Only</option>
              <option value="DISABLED">Draft / Inactive</option>
            </select>
          </div>
        </div>

        {/* Add Testimonial Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedTestimonial(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 h-10 px-4 rounded-base bg-gold-500 text-xs font-semibold text-navy-950 hover:bg-gold-400 transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Datatable Card */}
      <div className="rounded-xl border border-navy-800 bg-navy-900/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-navy-800 bg-navy-950/60 text-[11px] font-semibold uppercase tracking-wider text-navy-300">
                <th className="py-3.5 px-4">Client & Media</th>
                <th className="py-3.5 px-4">Role / Location</th>
                <th className="py-3.5 px-4">Quote / Highlight</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 text-xs text-navy-200">
              {filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-navy-400">
                    No testimonials found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-navy-800/40 transition-colors"
                  >
                    {/* Client & Media */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 rounded-lg overflow-hidden bg-navy-950 border border-navy-800 flex items-center justify-center text-gold-400">
                          {t.posterImage ? (
                            <Image
                              src={t.posterImage}
                              alt={t.clientName}
                              width={40}
                              height={48}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : t.videoSrc ? (
                            <div className="flex flex-col items-center justify-center text-gold-400">
                              <Play className="h-4 w-4 fill-gold-400" />
                            </div>
                          ) : (
                            <Quote className="h-4 w-4 opacity-60" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white truncate text-small">
                              {t.clientName}
                            </p>
                            {t.featured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/40">
                                <Sparkles className="h-2.5 w-2.5" />
                                Featured
                              </span>
                            )}
                          </div>
                          {t.videoSrc ? (
                            <p className="text-[11px] text-emerald-400 font-mono truncate mt-0.5">
                              🎥 {t.videoSrc.split("/").pop()}
                            </p>
                          ) : (
                            <p className="text-[11px] text-navy-400 italic">No video attached</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role / Location */}
                    <td className="py-3.5 px-4">
                      <span className="text-navy-300">
                        {t.clientRoleOrLocation || "—"}
                      </span>
                    </td>

                    {/* Quote / Highlight */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {t.quote ? (
                        <p className="text-[11px] text-navy-300 line-clamp-2 italic">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      ) : (
                        <span className="text-navy-500 text-xs italic">No written quote</span>
                      )}
                    </td>

                    {/* Visibility Status */}
                    <td className="py-3.5 px-4">
                      {t.enabled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-medium text-emerald-400">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          <span>Visible</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy-950 border border-navy-800 text-[10px] font-medium text-navy-400">
                          <XCircle className="h-2.5 w-2.5" />
                          <span>Draft / Hidden</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTestimonial(t);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-base border border-navy-700 bg-navy-950 text-xs font-medium text-navy-200 hover:border-gold-400/40 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3 text-gold-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTestimonial(t)}
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
            Showing {filteredTestimonials.length} of {testimonials.length} client testimonials
          </span>
          <span className="font-mono text-[11px] text-navy-500">
            Realtime DB CRUD Active
          </span>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        testimonial={selectedTestimonial}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTestimonial(null);
        }}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTestimonial}
        title="Delete Testimonial"
        message={`Are you sure you want to permanently delete the testimonial from "${deleteTestimonial?.clientName}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTestimonial(null)}
      />
    </div>
  );
}
