import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import ComingSoonModal from "./CommingSoonModal";
import SEO from "../../components/SEO";

const YEARS = [
  {
    year: 1,
    title: "First Year",
    description: "Fundamental engineering subjects",
    icon: "BookOpen",
  },
  {
    year: 2,
    title: "Second Year",
    description: "Core discipline subjects and applied knowledge",
    icon: "CodeXml",
  },
  {
    year: 3,
    title: "Third Year",
    description: "Advanced topics and specialization subjects",
    icon: "Cpu",
  },
  {
    year: 4,
    title: "Final Year",
    description: "Projects, electives, and industry-focused learning",
    icon: "GraduationCap",
  },
];

const YearNotesList = () => {
  const navigate = useNavigate();

  //temporary
  const [open, setOpen] = useState(false);

  const handleYearSelect = (year) => {
    // navigate(`/notes/year/${year}`);
    //temporary
     setOpen(true);
  };

  //temporary
   const handleExplorePYQ = () => {
    setOpen(false);
    navigate("/pyq/semesters"); 
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="B.Tech Notes by Year – AKTU Notes"
        description="Browse AKTU B.Tech notes organized by academic year. Access first year to final year study material for all subjects."
        keywords="AKTU year wise notes, BTech year 1 notes, BTech year 2 notes, AKTU study material"
        path="/notes/years"
      />
      <Header />
<main className="flex-1 flex items-center pt-20">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full ">

          {/* Heading */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
              Choose Your Academic Year
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Explore structured, exam-focused notes tailored to your academic journey.
            </p>
          </div>

          {/* Year Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6  ">
            {YEARS.map((item) => (
              <button
  onClick={() => handleYearSelect(item.year)}
  key={item.year}
  className="
  group w-full text-left
  cursor-pointer
  bg-card
  border-2 
  sm:border-primary
  shadow-md
  rounded-2xl
  p-6
  flex flex-col 
  sm:flex-row
  items-start 
  xs:items-center
  justify-between
  gap-4
  transition-all duration-300
  lg:border lg:border-border
  lg:shadow-none
  lg:hover:border-primary
  lg:hover:shadow-lg
  lg:hover:-translate-y-1
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-primary
"

>

                {/* Icon */}
                <div className="
                  w-14 h-14 rounded-xl
                  bg-primary/10
                  flex items-center justify-center
                  transition-colors
                  group-hover:bg-primary/20
                ">
                  <Icon
                    name={item.icon}
                    size={26}
                    className="text-primary"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
  <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
    {item.title}
  </h2>
  <p className="mt-1 text-sm sm:text-base text-muted-foreground">
    {item.description}
  </p>

                </div>

                {/* Arrow */}
                <div
  className="
    text-primary
    lg:opacity-0
    lg:translate-x-2
    transition-all duration-300
    lg:group-hover:opacity-100
    lg:group-hover:translate-x-0
  "
>
  <Icon name="ChevronRightIcon" size={30} />
</div>

              </button>
            ))}
          </div>

        </div>
      </main>
      <ComingSoonModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onExplore={handleExplorePYQ}
      />
    </div>
  );
};

export default YearNotesList;
