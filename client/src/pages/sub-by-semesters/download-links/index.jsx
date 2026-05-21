import React from "react";
import Icon from "../../../components/AppIcon";
import Header from "../../../components/ui/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPyqsQuery } from "../../../features/pyq/pyqApi";
import { useUpdateDounloadCountPyqMutation } from "../../../features/dashboard/pyqStats";

/* TEMP DATA */

const SelectedSubjectPYQDownloads = () => {
  const {subject, year} = useParams();
  const navigate = useNavigate();

    const { data: pyqs = [], isLoading, isError } = useGetPyqsQuery();
    const [updateDownloadCount] = useUpdateDounloadCountPyqMutation();


     const filteredPyqs = React.useMemo(() => {
    return pyqs.filter(
      (item) =>
        item.isActive &&
        item.subject.toLowerCase() === subject.toLowerCase() &&
        String(item.year) === String(year)
    ).sort((a, b) => b.AcademicYear.localeCompare(a.AcademicYear));
  }, [pyqs, subject, year]);

  const handleBack = () => navigate(-1);

  const handleDownloadCount = async (year) => {
  if (!year) return;
  try {
    await updateDownloadCount({ year }).unwrap();
  } catch (err) {
    console.error("Download count update failed", err);
  }
};



  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="pt-32 text-center text-muted-foreground">
          Loading PYQs...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <p className="pt-32 text-center text-destructive">
          Failed to load PYQs
        </p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background m-auto">
      <Header />

      <main className="pt-24 pb-20 m-auto mx-auto">
        
        <div className="flex items-center gap-3 mb-8 max-w-3xl mx-auto">
          <button
            onClick={handleBack}
            className="p-1 rounded-lg hover:bg-muted transition cursor-pointer"
          >
            <Icon name="ChevronLeft" size={25} className="text-foreground" />
          </button>

          <div>
            <h1 
             onClick={handleBack}
            className=" cursor-pointer p-1 text-xl md:text-2xl font-semibold flex align-center text-foreground">
              Select Subject
            </h1>
            {/* <p className="text-muted-foreground text-sm">
              GOTO Subject
            </p> */}
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
      <div className="mb-8 m-auto max-w-3xl bg-card p-4 py-4 rounded-xl">
  <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
    {subject} {year} Year AKTU PYQs
  </h1>
 
</div>


          {/* Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden max-w-3xl m-auto">
  
  {/* Table Header */}
  <div className=" grid grid-cols-2 px-6 py-4 bg-muted/40 text-sm font-medium text-muted-foreground">
    <div className="text-left">Academic Year</div>
    <div className="text-left">Download</div>
  </div>

  {/* Rows */}
    {filteredPyqs.length === 0 && (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No PYQs available for this subject.
              </div>
            )}
  {filteredPyqs.map((pyq) => (
    <div
      key={pyq._id}
      className="
        grid grid-cols-2 items-center
        px-6 py-5
        border-t border-border
        hover:bg-muted/30
        transition-colors
      "
    >
      {/* Year column */}
      <div className="flex items-center gap-2">
        <Icon name="Calendar" size={16} className="text-muted-foreground" />
        <span className="text-foreground font-medium">
          {pyq.AcademicYear}
        </span>
      </div>

      {/* Download column */}
    <a
  href={pyq.pdfUrl}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => handleDownloadCount(pyq.year)}
  className="
    inline-flex items-center gap-2
    text-primary font-medium
    hover:underline
    transition
    cursor-pointer
  "
>
  Download PDF
  <Icon name="ArrowRight" size={14} />
</a>

    </div>
  ))}
</div>


          {/* Footer Note */}
          <p className="mt-6 text-sm text-muted-foreground max-w-3xl m-auto">
            PYQs are regularly updated to align with university exam.
          </p>

        </div>
      </main>
    </div>
  );
};

export default SelectedSubjectPYQDownloads;
