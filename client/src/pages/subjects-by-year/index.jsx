import { useState } from "react";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import { useNavigate, useParams } from "react-router-dom";
import { ALL_SUBJECTS } from "../../constants/subjects";


const SubjectsByYear = () => {
    const { year } = useParams();

    const navigate = useNavigate();

    const YEAR_LABELS = {
        1: "1st",
        2: "2nd",
        3: "3rd",
        4: "4th",
    };

    const selectedYr = YEAR_LABELS[year] || "your";

    const handleYearChange = (e) => {
        navigate(`/notes/year/${e.target.value}`);
    };



    const SUBJECTS = ALL_SUBJECTS
        .filter((s) => s.year === Number(year))
    // .filter((s) =>
    //   s.name.toLowerCase().includes(search.toLowerCase())
    // );


    const [search, setSearch] = useState("");

    const filteredSubjects = SUBJECTS.filter((subject) =>
        subject.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* MAIN CONTENT */}
            <main className="pt-24 px-4 pb-12">
                <div className="max-w-6xl mx-auto">

                    {/* HEADING */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                                Subjects for {selectedYr} Year
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Browse and download subject-wise notes
                            </p>
                        </div>

                        <div className="max-w-full sm:w-44">
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
                                key={subject.id}
                                className="
                  bg-card border border-border
                  rounded-2xl overflow-hidden
                  transition-all duration-300
                  hover:shadow-lg
                "
                            >
                                {/* IMAGE (50%) */}
                                {/* <div className="h-40 w-full overflow-hidden">
                                    <img
                                        src={subject.image}
                                        alt={subject.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div> */}

                                {/* CONTENT */}
                                <div className="p-4 flex flex-col">
                                    <p className="text-xs text-muted-foreground">
                                        {subject.code}
                                    </p>

                                    <h3 className="text-lg font-semibold text-foreground mt-1">
                                        {subject.name}
                                    </h3>

                                    <p className="text-sm text-muted-foreground mb-3">
                                        {subject.units} Units
                                    </p>

                                    <hr className="border-border mb-3" />

                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-foreground">
                                            ₹{subject.price}
                                        </span>

                                        <button
                                            className="
                                            flex cursor-pointer items-center gap-1
                                             text-primary text-sm font-medium
                                              hover:underline"

                                            onClick={() => { navigate(`/year/${subject.year}/subject/${subject.name}`) }}

                                        >
                                            Download
                                            <Icon name="ArrowRight" size={16} />
                                        </button>
                                    </div>
                                </div>
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

export default SubjectsByYear;
