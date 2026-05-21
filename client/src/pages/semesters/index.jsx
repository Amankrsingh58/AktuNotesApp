import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import SEO from "../../components/SEO";

const SEMESTERS = [
  {
    id: 1,
    title: "1st Year (sem 1 +sem 2)",
    icon: "BookOpen",
  },
  {
    id: 2,
    title: "3rd Semester",
    icon: "CodeXml",
  },
  {
    id: 2,
    title: "4th Semester",
    icon: "CodeXml",
  },
  {
    id: 3,
    title: "5th Semester",
    icon: "Cpu",
  },
  {
    id: 3,
    title: "6th Semester",
    icon: "Cpu",
  },
  {
    id: 4,
    title: "7th Semester",
    icon: "GraduationCap",
  },
  {
    id: 4,
    title: "8th Semester",
    icon: "GraduationCap",
  },
];

const SemesterNotesList = () => {
  const navigate = useNavigate();

  const handleSelect = (id) => {
    console.log("Selected Semester ID:", id);
    navigate(`/pyq/semester-or-year/${id}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="AKTU PYQ by Semester – Previous Year Question Papers"
        description="Download semester-wise AKTU previous year question papers (PYQs). Select your semester and access exam-focused question papers for all subjects."
        keywords="AKTU PYQ, AKTU previous year papers, semester wise PYQ, AKTU exam papers, BTech question papers"
        path="/pyq/semesters"
      />
      <Header />

      <main className="flex-1 flex items-center pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          
          {/* Heading */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
              Choose Your Semester
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Select your semester to access Previous Year Questions.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 sm:w-full gap-6 lg:max-w-2xl mx-auto">
            {SEMESTERS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelect(item.id)}
                className={`
                  group w-full tex
                  t-left
                  bg-card
                   border-1
                   cursor-pointer
                   sm:border-primary
                  rounded-2xl
                  flex items-center justify-between gap-4
                  transition-all duration-300
                  hover:border-primary hover:shadow-lg hover:-translate-y-1
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
  lg:border lg:border-border
  lg:shadow-none
  lg:hover:border-primary
  lg:hover:shadow-lg
  lg:hover:-translate-y-1

                  ${index === 0 ? "md:col-span-2" : ""}
                `}
              >
                {/* Icon */}
                <div className="
                  w-14 h-14 rounded-xl
                  bg-primary/10
                  flex items-center justify-center
                  group-hover:bg-primary/20
                  transition-colors
                ">
                  <Icon
                    name={item.icon}
                    size={26}
                    className="text-primary"
                  />
                </div>

                {/* Title */}
                <h2 className="flex-1 text-xl sm:text-xl font-semibold text-foreground">
                  {item.title}
                </h2>

                {/* Arrow */}
                <div className="
                  text-primary
                  
                  opacity-0 translate-x-2
                  group-hover:opacity-100 group-hover:translate-x-0
                  transition-all duration-300
                ">
                  <Icon name="ChevronRightIcon" size={30} />
                </div>
              </button>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default SemesterNotesList;
