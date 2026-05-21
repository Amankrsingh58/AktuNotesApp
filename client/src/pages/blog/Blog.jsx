import React from "react";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import SEO from "../../components/SEO";

const VlogArticleTemp = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AKTU Exam Preparation Strategy – Blog | AKTU Notes"
        description="Learn how to prepare for AKTU semester exams smartly using PYQs, notes, and time management. A practical guide for B.Tech students."
        keywords="AKTU exam preparation, AKTU study tips, BTech exam strategy, AKTU PYQ strategy, semester exam tips"
        path="/blogs"
      />
      <Header />

      <main className="pt-24 pb-20">
        {/* HERO */}
        <section className="max-w-4xl mx-auto px-4 mb-10">
          <span className="inline-block mb-3 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            AKTU STRATEGY
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            How to Prepare AKTU Semester Exams Smartly (Without Burnout)
          </h1>

          <p className="mt-4 text-muted-foreground text-lg">
            A practical, experience-based guide for B.Tech students to score
            well using PYQs, notes & time management.
          </p>

          <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="Calendar" size={16} />
              Updated Jan 2026
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Clock" size={16} />
              8 min read
            </span>
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-4xl mx-auto px-4 space-y-10 text-[17px] leading-relaxed">
          {/* INTRO */}
          <p className="text-foreground">
            AKTU exams don’t require studying everything. Most students fail
            not because of syllabus difficulty, but because of poor strategy.
            This guide will help you focus on what actually matters.
          </p>

          {/* HIGHLIGHT BOX */}
          <div className="border-l-4 border-primary bg-primary/5 p-5 rounded-xl">
            <h3 className="font-semibold text-foreground mb-2">
              🎯 Key Takeaway
            </h3>
            <p className="text-muted-foreground">
              If you master PYQs + limited notes + revision cycles, you can
              comfortably score 7–8 CGPA.
            </p>
          </div>

          {/* SECTION */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              1. Don’t Start With Full Syllabus
            </h2>
            <p className="text-muted-foreground">
              AKTU follows a pattern. Around 70–80% questions repeat from
              previous years. Jumping directly into textbooks wastes time.
            </p>
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-card border border-border p-5 rounded-xl">
              <h4 className="font-medium text-foreground mb-2">
                ❌ Common Mistake
              </h4>
              <p className="text-muted-foreground text-sm">
                Reading entire books line-by-line without PYQs.
              </p>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl">
              <h4 className="font-medium text-foreground mb-2">
                ✅ Smart Approach
              </h4>
              <p className="text-muted-foreground text-sm">
                Start with last 10 years PYQs → map syllabus → study only asked
                topics.
              </p>
            </div>
          </div>

          {/* WARNING */}
          <div className="flex gap-4 bg-destructive/10 p-5 rounded-xl">
            <Icon name="AlertTriangle" size={22} className="text-destructive" />
            <p className="text-sm text-muted-foreground">
              Avoid YouTube hopping. Consuming too many strategies creates
              confusion and panic.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-muted/40 p-6 rounded-2xl text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Want Ready-Made PYQs & Notes?
            </h3>
            <p className="text-muted-foreground mb-4">
              Download subject-wise AKTU PYQs and notes prepared using exam
              patterns.
            </p>

            <a
              href="/pyq/semesters"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition"
            >
              Explore PYQs
              <Icon name="ArrowRight" size={16} />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VlogArticleTemp;
