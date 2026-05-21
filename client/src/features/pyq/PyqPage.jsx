import React, { useState, useMemo } from "react";
import {
  useCreatePyqMutation,
  useDeletePyqMutation,
  useUpdatePyqMutation,
  useGetDashboardPyqsQuery,
} from "./pyqApi";
import Form from "./Form";
import Editmodal from "./EditModal";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export default function PyqPage() {
  const { data: pyqs = [], isLoading } = useGetDashboardPyqsQuery();
  const {isAuthenticated, role} = useSelector((state) => state.auth);

  const [createPyq, { isLoading: isCreating }] = useCreatePyqMutation();
  const [deletePyq] = useDeletePyqMutation();
  const [updatePyq, { isLoading: isUpdating }] = useUpdatePyqMutation();

  const [editingPyq, setEditingPyq] = useState(null);

  // ✅ FILTER STATE
  const [filters, setFilters] = useState({
    year: "",
    academicYear: "",
    subject: "",
    date: "",
    createdBy:""
  });

  const handleCreate = async (e, form) => {
    e.preventDefault();
    try {
      await createPyq(form).unwrap();
      toast.success("PYQ created successfully");
      e.target.reset();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create PYQ");
    }
  };

  const handleUpdate = async (e, form) => {
    e.preventDefault();
    try {
      await updatePyq({
        id: editingPyq._id,
        data: form,
      }).unwrap();
      toast.success("PYQ updated successfully");
      setEditingPyq(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update PYQ");
    }
  };

  // ✅ FILTER LOGIC (RUNS ONLY WHEN FILTERS CHANGE)
  const filteredPyqs = useMemo(() => {
    return pyqs
      .filter((item) => {
        if (!item.isActive) return false;

        if (filters.year && String(item.year) !== filters.year) return false;
        if (
          filters.academicYear &&
          item.AcademicYear !== filters.academicYear
        )
          return false;
        if (
          filters.subject &&
          !item.subject.toLowerCase().includes(filters.subject.toLowerCase())
        )
          return false;
        if (filters.date) {
          const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
          if (itemDate !== filters.date) return false;
        }
        if (filters.createdBy) {
          if (item.createdBy?.role !== filters.createdBy) return false;
        }

        return true;
      })
      .sort((a, b) => b.AcademicYear.localeCompare(a.AcademicYear));
  }, [pyqs, filters]);

  if (isLoading) {
    return <div className="text-muted-foreground">Loading PYQs...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl text-foreground font-semibold">PYQ Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage previous year question papers
        </p>
      </div>

      {/* Create */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4">Add New PYQ</h2>
        <Form onSubmit={handleCreate} submitLabel="Create PYQ" isLoading={isCreating} />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header + Filters */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-medium">All PYQs</h2>

            <div className="grid grid-cols-1 cursor-pointer sm:grid-cols-3 gap-3 w-full sm:max-w-3xl">
              {/* Year */}
              <select
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
                }
                className="px-3 bg-card cursor-pointer py-2  border border-border rounded-lg text-sm"
              >
                <option className="cursor-pointer" value="">All Years</option>
                <option className="cursor-pointer" value="1">1st Year</option>
                <option className="cursor-pointer" value="2">2nd Year</option>
                <option className="cursor-pointer" value="3">3rd Year</option>
                <option className="cursor-pointer" value="4">4th Year</option>
              </select>

              {/* Academic Year */}
              <select
                value={filters.academicYear}
                onChange={(e) =>
                  setFilters({ ...filters, academicYear: e.target.value })
                }
                className="px-3 bg-card cursor-pointer py-2  border border-border rounded-lg text-sm"
              >
                <option className="cursor-pointer" value="">All Academic Years</option>
                {[...new Set(pyqs.map((p) => p.AcademicYear))].map((ay) => (
                  <option className="cursor-pointer bg-card" key={ay} value={ay}>
                    {ay}
                  </option>
                ))}
              </select>

              {/* Subject */}
              <input
                type="text"
                placeholder="Search subject"
                value={filters.subject}
                onChange={(e) =>
                  setFilters({ ...filters, subject: e.target.value })
                }
                className="px-3 py-2  border border-border rounded-lg text-sm"
              />

              {/* Date  */}
              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
                className="px-3 py-2 bg-card   border border-border rounded-lg text-sm"
              />

              {/* Created By  */}
              <select
                value={filters.createdBy}
                onChange={(e) =>
                  setFilters({ ...filters, createdBy: e.target.value })
                }
                className="px-3 bg-card cursor-pointer py-2  border border-border rounded-lg text-sm"
              >
                <option className="cursor-pointer" value="">All Created By</option>
                <option className="cursor-pointer" value="admin">Admin</option>
              </select>

              {/* Reset Filter  */}
              <button
                onClick={() =>
                  setFilters({ year: "", academicYear: "", subject: "", date: "",createdBy:"" })
                }
                className="px-5 py-2.5 rounded-lg
            bg-primary text-primary-foreground
            hover:opacity-90
            transition
            cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredPyqs.length === 0 ? (
          <div className="p-6 text-muted-foreground">
            No PYQs found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-muted-foreground">
                  <th className="px-6 py-3 text-left">Year</th>
                  <th className="px-6 py-3 text-left">Sem</th>
                  <th className="px-6 py-3 text-left">Subject</th>
                  <th className="px-6 py-3 text-left">Academic</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredPyqs.map((pyq) => (
                  <tr key={pyq._id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">{pyq.year}</td>
                    <td className="px-6 py-4">{pyq.semester ?? "-"}</td>
                    <td className="px-6 py-4">{pyq.subject}</td>
                    <td className="px-6 py-4">{pyq.AcademicYear}</td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <button
                        onClick={() => setEditingPyq(pyq)}
                        className="cursor-pointer text-primary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePyq(pyq._id)}
                        className="cursor-pointer text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPyq && (
        <Editmodal
          pyq={editingPyq}
          onClose={() => setEditingPyq(null)}
          onUpdate={handleUpdate}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
