import { useState } from "react";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import { useNavigate, useParams } from "react-router-dom";
import SEO from "../../components/SEO";
import { ALL_SUBJECTS } from "../../constants/subjects";


const SubBySemesters = () => {
    const navigate = useNavigate();
    const { year } = useParams();
    console.log("Year param:", year);
    const SUBJECTS = ALL_SUBJECTS.filter((subject) => subject.year === Number(year));



    const [search, setSearch] = useState("");

    const handleYearChange = (e) => {
        navigate(`/pyq/semester-or-year/${e.target.value}`);
    };

    const filteredSubjects = SUBJECTS.filter((subject) =>
        subject.name.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div className="min-h-screen bg-background">
            <SEO
                title={`Year ${year} PYQs – AKTU Previous Year Question Papers`}
                description={`Download AKTU year ${year} previous year question papers (PYQs) for all subjects. Free, exam-focused study resources.`}
                keywords={`AKTU year ${year} PYQ, BTech year ${year} question papers, AKTU semester papers`}
                path={`/pyq/semester-or-year/${year}`}
            />
            <Header />

            {/* MAIN CONTENT */}
            <main className="pt-24 px-4 pb-12">
                <div className="max-w-6xl mx-auto">

                    {/* HEADING */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                                PYQs for {year} Year
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Download subject-wise PYQs
                            </p>
                        </div>

                        <div className="w-full sm:w-44">
                            <select
                                value={year}
                                onChange={handleYearChange}
                                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>


                    </div>


                    {/* SEARCH BAR */}
                    <div className="bg-card border border-border rounded-xl p-4 mb-8">
                        <div className="relative">
                            <Icon
                                name="Search"
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                                type="text"
                                placeholder="Search subject by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="
                  w-full pl-10 pr-4 py-2
                  bg-background
                  border border-input
                  rounded-lg
                  text-foreground
                  placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary
                "
                            />
                        </div>
                    </div>

                    {/* SUBJECT CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSubjects.map((subject) => (
                            <div
                            onClick={() => { navigate(`/pyq/semester-or-year/${subject.year}/subject/${subject.name}`) }}
                                key={subject.id}
                                className="
    group relative
    bg-card border border-border
    rounded-2xl p-4 py-6
    flex items-center justify-between
    cursor-pointer
    transition-all duration-300
    hover:-translate-y-1 hover:border-primary hover:shadow-lg
    active:scale-95
  "
                            >
                                {/* Left Content */}
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {subject.name}
                                    </h3>

                                </div>

                                {/* Simple Arrow */}
                                <Icon
                                    name="ChevronRightIcon"
                                    size={20}
                                    className="
      text-muted-foreground
      transition-transform duration-300
      group-hover:translate-x-1
      group-hover:text-primary
    "
                                />
                            </div>

                        ))}
                    </div>

                    {/* EMPTY STATE */}
                    {filteredSubjects.length === 0 && (
                        <p className="text-center text-muted-foreground mt-10">
                            No subjects found
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SubBySemesters;
