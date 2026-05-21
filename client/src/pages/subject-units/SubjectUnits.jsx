import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import { useGetNotesQuery } from "../../features/notes/notesApi";
import { useUpdateNotesDownloadCountMutation } from "../../features/dashboard/pyqStats";
import { useInitiatePaymentMutation } from "../../features/payment/paymentApi";
import { ALL_SUBJECTS } from "../../constants/subjects";
import toast from "react-hot-toast";

const UNITS = [
  { id: 1, title: "Unit 1" },
  { id: 2, title: "Unit 2" },
  { id: 3, title: "Unit 3" },
  { id: 4, title: "Unit 4" },
  { id: 5, title: "Unit 5" },
  { id: "all", title: "All Units (Combined)" },
];


const SubjectUnits = () => {
  const { data: notes = [], isLoading, isError } = useGetNotesQuery();
  const [updateDownloadCount] = useUpdateNotesDownloadCountMutation();
  const [initiatePayment] = useInitiatePaymentMutation();
  const {year, subject} = useParams();
  
  const navigate = useNavigate();

  const currentSubject = React.useMemo(() => {
    return ALL_SUBJECTS.find(s => s.name.toLowerCase() === subject.toLowerCase() && String(s.year) === String(year));
  }, [subject, year]);

  const filteredNotes = React.useMemo(() => {
    return notes.filter(
      (item) =>
        item.isActive &&
        item.subject.toLowerCase() === subject.toLowerCase() &&
        String(item.year) === String(year)
    );
  }, [notes, subject, year]);

  const handleBack = () => navigate(-1);

  const handleDownload = async (e, unit) => {
    // If subject has a price, initiate payment
    if (currentSubject && currentSubject.price > 0) {
      e.preventDefault();
      try {
        const response = await initiatePayment({
          amount: currentSubject.price,
          subjectName: currentSubject.name,
          unitId: unit._id
        }).unwrap();

        if (response.success && response.url) {
          window.location.href = response.url; // Redirect to PhonePe
        } else {
          toast.error("Failed to initiate payment");
        }
      } catch (err) {
        console.error("Payment error:", err);
        toast.error("Payment initialization failed");
      }
      return;
    }

    // If free or already paid (future logic), just update count
    try {
      await updateDownloadCount({ year: unit.year }).unwrap();
    } catch (err) {
      console.error("Notes download count update failed", err);
    }
  };
if (isLoading) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4">
        {/* Page title skeleton */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="h-8 w-64 bg-muted rounded-lg animate-pulse mb-3" />
          <div className="h-4 w-40 bg-muted rounded-md animate-pulse" />
        </div>

        {/* Card skeleton */}
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl overflow-hidden">
          
          {/* Table header skeleton */}
          <div className="grid grid-cols-2 px-6 py-4 bg-muted/40">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>

          {/* Rows skeleton */}
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-2 items-center px-6 py-5 border-t border-border"
            >
              <div className="h-4 w-28 bg-muted rounded animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </main>
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
      };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-8 ">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-muted transition"
          >
            <Icon name="ArrowLeft" size={20} className="text-foreground" />
          </button>

          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Select Subject
            </h1>
            <p className="text-muted-foreground text-sm">
              Download unit-wise notes
            </p>
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredNotes.length === 0 && (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No Notes available for this subject.
              </div>
            )}
          {filteredNotes.map((unit) => (
            <div
              key={unit._id}
              className="
                animated-border
                bg-card border border-border
                rounded-xl p-6
                flex flex-col justify-between
                transition-all duration-200
                hover:-translate-y-1 hover:shadow-lg
              "
            >
              {/* Top row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon
                    name={unit.id === "all" ? "Layers" : "BookOpen"}
                    size={20}
                    className="text-primary"
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                 Unit  {unit.Unit}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-6">
                {subject}
              </p>

              {/* Download button */}
              <a
               href={unit.pdfUrl}
               target="_blank"
               rel="noopener noreferrer"
                onClick={(e) => handleDownload(e, unit)}
                className="
                  w-full 
                  cursor-pointer
                  flex items-center justify-center gap-2
                  py-3 rounded-lg
                  bg-primary text-primary-foreground
                  font-medium
                  hover:bg-primary/90
                  transition
                "
              >
                <Icon name="Download" size={18} />
                Download Now
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SubjectUnits;
