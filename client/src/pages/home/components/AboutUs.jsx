import Header from "../../../components/ui/Header";
import SEO from "../../../components/SEO";

export default function AboutUs() {
  return (
    <>
      <SEO
        title="About AKTU Notes – Our Mission & Vision"
        description="Learn about AKTU Notes, the student-focused platform providing free PYQs and exam-oriented resources for B.Tech students of Dr. A.P.J. Abdul Kalam Technical University."
        keywords="about AKTU Notes, AKTU student platform, AKTU exam resources, AKTU university notes"
        path="/aboutus"
      />
      {/* FIXED NAVBAR */}
      <Header />

      {/* PAGE CONTENT */}
      <main className="max-w-6xl bg-background mx-auto px-4 pt-24 pb-10 space-y-8">
        {/* ↑ pt-24 pushes content below fixed navbar */}

        {/* SEO HEADER */}
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            About AKTU Notes
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            AKTU Notes is a student-focused platform providing PYQs and
            exam-oriented resources for B.Tech students of AKTU.
          </p>
        </header>

        {/* CONTENT CARD */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-6">
          
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">
              Who We Are
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">AKTU Notes</strong> is built
              to help B.Tech students of Dr. A.P.J. Abdul Kalam Technical
              University prepare efficiently using reliable and
              exam-focused resources.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">
              Our Mission
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our mission is to make quality academic resources easily
              accessible, reduce confusion during exam preparation, and
              help students focus on high-priority topics.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">
              What We Offer
            </h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Semester-wise Previous Year Question Papers (PYQs)</li>
              <li>AKTU syllabus-aligned resources</li>
              <li>Clean and distraction-free interface</li>
              <li>Student-centric content organization</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">
              Why AKTU Notes
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unlike random online sources, AKTU Notes is focused only on
              AKTU students, making it more relevant, structured, and
              exam-oriented.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">
              What’s Coming Next
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are working on structured notes, better categorization,
              and additional learning tools to support students
              throughout their B.Tech journey.
            </p>
          </section>

        </section>
      </main>
    </>
  );
}
