"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Tag,
  BookOpen,
} from "lucide-react";
import { AdminCourse, CourseModal } from "../modals/CourseModal";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";

interface CoursesTabProps {
  courses: AdminCourse[];
  onCoursesUpdated: (courses: AdminCourse[]) => void;
}

export function CoursesTab({
  courses,
  onCoursesUpdated,
}: CoursesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<AdminCourse | null>(null);

  const [deleteCourse, setDeleteCourse] = useState<AdminCourse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    courses.forEach((c) => {
      if (c.category) cats.add(c.category);
    });
    return Array.from(cats);
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || c.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  // Handle Save
  const handleSaved = (savedCourse: AdminCourse) => {
    const exists = courses.some((c) => c.id === savedCourse.id);
    let updated: AdminCourse[];
    if (exists) {
      updated = courses.map((c) => (c.id === savedCourse.id ? savedCourse : c));
    } else {
      updated = [savedCourse, ...courses];
    }
    onCoursesUpdated(updated);
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteCourse) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/courses/${deleteCourse.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Delete failed");
        setIsDeleting(false);
        return;
      }

      onCoursesUpdated(courses.filter((c) => c.id !== deleteCourse.id));
      setDeleteCourse(null);
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
              placeholder="Search courses by title, slug..."
              className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 pl-10 pr-4 text-xs text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 px-3 text-xs text-navy-200 focus:border-gold-400 focus:outline-none"
            >
              <option value="ALL">All Disciplines ({courses.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Course Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedCourse(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 h-10 px-4 rounded-base bg-gold-500 text-xs font-semibold text-navy-950 hover:bg-gold-400 transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Datatable Card */}
      <div className="rounded-xl border border-navy-800 bg-navy-900/80 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-navy-800 bg-navy-950/60 text-[11px] font-semibold uppercase tracking-wider text-navy-300">
                <th className="py-3.5 px-4">Course & Overview</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4">Enrollment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 text-xs text-navy-200">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-navy-400">
                    No courses found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-navy-800/40 transition-colors"
                  >
                    {/* Course & Overview */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-navy-950 border border-navy-800 flex items-center justify-center text-gold-400">
                          {course.image ? (
                            <Image
                              src={course.image}
                              alt={course.title}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <BookOpen className="h-5 w-5 opacity-60" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-medium text-white truncate text-small">
                            {course.title}
                          </p>
                          <p className="text-[11px] text-navy-400 font-mono truncate">
                            /{course.slug}
                          </p>
                          <p className="text-[11px] text-navy-300 truncate mt-0.5 line-clamp-1">
                            {course.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy-950 border border-navy-800 text-[11px] text-navy-200">
                        <Tag className="h-2.5 w-2.5 text-gold-400" />
                        <span>{course.category || "General"}</span>
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5 px-4 font-mono">
                      {course.price !== null ? (
                        <div className="space-y-0.5">
                          <div className="text-gold-400 font-medium">₹{course.price.toLocaleString("en-IN")}</div>
                          {course.originalPrice && (
                            <div className="text-[10px] text-navy-400 line-through">
                              ₹{course.originalPrice.toLocaleString("en-IN")}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-navy-400 text-xs italic">Price on request</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {course.enabled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-medium text-emerald-400">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          <span>Open for Enrollment</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy-950 border border-navy-800 text-[10px] font-medium text-navy-400">
                          <XCircle className="h-2.5 w-2.5" />
                          <span>Closed / Draft</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCourse(course);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-base border border-navy-700 bg-navy-950 text-xs font-medium text-navy-200 hover:border-gold-400/40 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3 text-gold-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteCourse(course)}
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
            Showing {filteredCourses.length} of {courses.length} academy courses
          </span>
          <span className="font-mono text-[11px] text-navy-500">
            Realtime DB CRUD Active
          </span>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <CourseModal
        isOpen={isModalOpen}
        course={selectedCourse}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourse(null);
        }}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteCourse}
        title="Delete Course"
        message={`Are you sure you want to permanently delete "${deleteCourse?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCourse(null)}
      />
    </div>
  );
}
