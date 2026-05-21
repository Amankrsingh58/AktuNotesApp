import { useEffect, useState, useMemo } from "react";
import Icon from "../../components/AppIcon";
import { ALL_SUBJECTS } from "../../constants/subjects";
import { getBaseUrl } from "../../utils/apiConfig";

export default function Form({
  onSubmit,
  initialData = null,
  submitLabel,
  isLoading = false,
}) {
  const [form, setForm] = useState({
    year: "",
    semester: "",
    AcademicYear: "",
    subject: "",
    pdfUrl: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const availableSubjects = useMemo(() => {
    if (!form.year) return [];
    return ALL_SUBJECTS.filter(s => s.year === Number(form.year));
  }, [form.year]);

  useEffect(() => {
    if (initialData) {
      setForm({
        year: initialData.year ?? "",
        semester: initialData.semester ?? "",
        AcademicYear: initialData.AcademicYear ?? "",
        subject: initialData.subject ?? "",
        pdfUrl: initialData.pdfUrl ?? "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    setIsUploading(true);
    try {
      const baseUrl = getBaseUrl().replace("/api", "");
        
      const response = await fetch(`${baseUrl}/api/upload/pdf`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setForm((prev) => ({ ...prev, pdfUrl: data.url }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload PDF");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => onSubmit(e, form)}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Year *
          </label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            placeholder="1, 2, 3, 4"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Semester */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Semester
          </label>
          <input
            type="number"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            placeholder="1 to 8"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Academic Year */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Academic Year *
          </label>
          <input
            name="AcademicYear"
            value={form.AcademicYear}
            onChange={handleChange}
            required
            placeholder="2023-2024"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Subject *
          </label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="">Select Subject</option>
            {availableSubjects.map(subject => (
              <option key={subject.id} value={subject.name}>
                {subject.name}
              </option>
            ))}
            {!form.year && <option disabled>Please select a year first</option>}
          </select>
        </div>

        {/* PDF URL – full width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            PDF URL *
          </label>
          <div className="flex gap-2">
            <input
              name="pdfUrl"
              value={form.pdfUrl}
              onChange={handleChange}
              required
              placeholder="https://drive.google.com/..."
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <div className="relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                disabled={isUploading}
              />
              <button
                type="button"
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-muted text-foreground border border-border
                  hover:bg-muted/80 transition min-w-[140px] justify-center
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Icon name="Upload" size={18} />
                )}
                <span>{isUploading ? 'Uploading...' : 'Choose PDF'}</span>
              </button>
            </div>
          </div>
          {form.pdfUrl && (
            <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <Icon name="CheckCircle" size={14} />
              PDF Selected/Uploaded
            </p>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className={`
            px-5 py-2.5 rounded-lg
            bg-primary text-primary-foreground
            hover:opacity-90
            transition
            flex items-center gap-2
            ${(isLoading || isUploading) ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
