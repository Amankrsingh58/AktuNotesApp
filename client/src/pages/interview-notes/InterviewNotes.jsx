import { useState } from "react";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

const INTERVIEW_CATEGORIES = [
  {
    id: 1,
    name: "Frontend",
    slug: "frontend",
  },
  {
    id: 2,
    name: "JavaScript",
    slug: "javascript",
  },
  {
    id: 3,
    name: "React",
    slug: "react",
  },
  {
    id: 4,
    name: "HTML",
    slug: "html",
  },
  {
    id: 5,
    name: "CSS",
    slug: "css",
  },
  {
    id: 6,
    name: "Node.js",
    slug: "nodejs",
  },
  {
    id: 7,
    name: "DSA",
    slug: "dsa",
  },
  {
    id: 8,
    name: "System Design",
    slug: "system-design",
  },
];

const InterviewQuestions = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredCategories = INTERVIEW_CATEGORIES.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Interview Questions – Topic-Wise Preparation | AKTU Notes"
        description="Prepare for tech interviews with topic-wise questions on JavaScript, React, Node.js, DSA, System Design, and more."
        keywords="interview questions, JavaScript interview, React interview, DSA questions, frontend interview, tech interview preparation"
        path="/interview-questions"
      />
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">

          {/* HEADING */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Interview Questions
            </h1>
            <p className="text-muted-foreground mt-1">
              Topic-wise interview preparation questions
            </p>
          </div>

          {/* SEARCH */}
          <div className="bg-card border border-border rounded-xl p-4 mb-8">
            <div className="relative">
              <Icon
                name="Search"
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search topics..."
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

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  navigate(`/interview-questions/${item.slug}`)
                }
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
                <h3 className="text-lg font-semibold text-foreground">
                  {item.name}
                </h3>

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

          {/* EMPTY */}
          {filteredCategories.length === 0 && (
            <p className="text-center text-muted-foreground mt-10">
              No topics found
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewQuestions;