"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ArrowRight,
  Users,
  Shield,
  BarChart3,
  FileJson,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/* ============================================================ */
/* State & Helpers */
/* ============================================================ */

interface StepState {
  expandedStep: number | null;
  hoveredCard: number | null;
}

const reviewSteps = [
  {
    num: "01",
    title: "Create Account",
    description:
      "Sign up as a student or teacher. Choose your role to set up your reviewer profile.",
    details:
      "Your account is private and only visible to the administrator. Use a username and secure password.",
    icon: Users,
    color: "bg-[var(--accent-soft)]",
  },
  {
    num: "02",
    title: "Read Introduction",
    description:
      "Understand the purpose and context of Mirror before beginning your perspective.",
    details:
      "Learn why this archive exists and what kind of honest feedback is most valuable.",
    icon: MessageSquare,
    color: "bg-[#d4a9a1]",
  },
  {
    num: "03",
    title: "Start Review",
    description:
      "Begin composing your six-step reflection about your experience.",
    details:
      "You can save your progress and return later to continue without losing your work.",
    icon: Clock,
    color: "bg-[#c9a896]",
  },
  {
    num: "04",
    title: "Complete Six Steps",
    description:
      "Work through context, ratings, traits, memories, advice, and overall feeling.",
    details:
      "Each step builds on the previous one to create a complete, thoughtful perspective.",
    icon: BarChart3,
    color: "bg-[#be9f8d]",
  },
  {
    num: "05",
    title: "Submit Perspective",
    description:
      "Publish your review and become part of the permanent archive.",
    details:
      "Your submission creates version one. All versions are preserved when you return to update.",
    icon: FileJson,
    color: "bg-[#a88b7b]",
  },
  {
    num: "06",
    title: "Update Later",
    description:
      "Return anytime to revise your perspective. Earlier versions remain in the archive.",
    details:
      "The system tracks all submissions, creating a timeline of how your perspective evolves.",
    icon: Clock,
    color: "bg-[#94776a]",
  },
];

const adminSteps = [
  {
    num: "01",
    title: "Admin Login",
    description:
      "Access the protected dashboard with administrator credentials.",
    details:
      "Only authorized administrators can view the complete archive and analytics.",
    icon: Shield,
  },
  {
    num: "02",
    title: "View Dashboard",
    description: "See an overview of all reviews, analytics, and key metrics.",
    details:
      "The dashboard shows current versions and latest submissions at a glance.",
    icon: BarChart3,
  },
  {
    num: "03",
    title: "Read Perspectives",
    description:
      "Browse individual reviews with full notes, ratings, and version history.",
    details:
      "Compare ratings and traits across the archive to spot patterns and insights.",
    icon: MessageSquare,
  },
  {
    num: "04",
    title: "Manage Timeline",
    description:
      "View the chronological submission history and version evolution.",
    details: "See how feedback and perspectives have changed over time.",
    icon: Clock,
  },
  {
    num: "05",
    title: "Reply to Reviews",
    description:
      "Respond to reviewers with gratitude, questions, or reflections.",
    details:
      "Keep conversations thoughtful and personal between you and each reviewer.",
    icon: MessageSquare,
  },
  {
    num: "06",
    title: "Export Archive",
    description: "Download all data in JSON format for personal archiving.",
    details:
      "Create a permanent, portable record of all perspectives and responses.",
    icon: FileJson,
  },
];

/* ============================================================ */
/* Interactive Step Card */
/* ============================================================ */

interface InteractiveStepCardProps {
  step: (typeof reviewSteps)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function InteractiveStepCard({
  step,
  index,
  isExpanded,
  onToggle,
}: InteractiveStepCardProps) {
  const Icon = step.icon;
  const delay = index * 40;

  return (
    <button
      onClick={onToggle}
      className="group/card w-full text-left transition-all duration-300 ease-out"
      style={{
        animation: `slideInUp 0.6s ${delay}ms ease-out backwards`,
      }}
    >
      <div
        className={`relative overflow-hidden rounded-[2px] border border-[var(--line)] transition-all duration-300 ${
          isExpanded
            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
            : "bg-[var(--paper)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
        }`}
      >
        {/* Gradient accent on hover */}
        <div
          className={`absolute -right-12 -top-12 h-24 w-24 rounded-full transition-all duration-500 ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div className="relative px-6 py-5 md:px-8 md:py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Number badge */}
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[2px] border transition-all duration-300 ${
                  isExpanded
                    ? "border-[var(--accent)] bg-white shadow-lg"
                    : "border-[var(--line)] bg-[var(--paper)]"
                }`}
              >
                <span className="font-mono text-xs font-bold text-[var(--ink)]">
                  {step.num}
                </span>
              </div>

              {/* Title and description */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg font-bold text-[var(--ink)] transition-colors duration-300 group-hover/card:text-[var(--accent-hover)]">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--ink-soft)] line-clamp-2">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Expand icon */}
            <ChevronDown
              className={`h-5 w-5 flex-shrink-0 text-[var(--muted)] transition-all duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Expanded details */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? "max-h-96 mt-4" : "max-h-0 mt-0"
            }`}
          >
            <div className="border-t border-[var(--line)] pt-4">
              <p className="text-sm leading-relaxed text-[var(--ink)]">
                {step.details}
              </p>
              {step === reviewSteps[4] && (
                <div className="mt-4 flex items-center gap-2 rounded bg-white/50 p-3 text-xs font-mono text-[var(--muted)]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]" />
                  Each submission is timestamped and preserved forever.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ============================================================ */
/* Feature Card with Hover Effect */
/* ============================================================ */

interface FeatureCardProps {
  icon: React.ComponentType<{ className: string }>;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group/feature relative"
      style={{
        animation: `fadeIn 0.6s ${200 + index * 100}ms ease-out backwards`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient that animates on hover */}
      <div
        className={`absolute inset-0 rounded-[2px] transition-all duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: `linear-gradient(135deg, var(--accent-soft) 0%, rgba(180, 93, 60, 0.05) 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative rounded-[2px] border border-[var(--line)] bg-[var(--paper)] p-6 transition-all duration-300 group-hover/feature:border-[var(--accent)] group-hover/feature:shadow-lg">
        {/* Icon container */}
        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-[2px] bg-[var(--accent-soft)] transition-all duration-300 ${
            isHovered
              ? "scale-110 bg-[var(--accent)] text-white shadow-lg"
              : "text-[var(--accent)]"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Title and description */}
        <h3 className="mt-4 font-serif text-lg font-bold text-[var(--ink)] transition-colors duration-300 group-hover/feature:text-[var(--accent-hover)]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          {description}
        </p>

        {/* Hover indicator line */}
        <div
          className={`mt-4 h-[2px] bg-[var(--accent)] transition-all duration-300 ${
            isHovered ? "w-12" : "w-0"
          }`}
        />
      </div>
    </div>
  );
}

/* ============================================================ */
/* Comparison Table */
/* ============================================================ */

function ComparisonTable() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const features = [
    { name: "Create Account", reviewer: true, admin: false },
    { name: "Submit Reviews", reviewer: true, admin: false },
    { name: "Update Versions", reviewer: true, admin: false },
    { name: "View Dashboard", reviewer: false, admin: true },
    { name: "Read All Reviews", reviewer: false, admin: true },
    { name: "Reply to Reviewers", reviewer: false, admin: true },
    { name: "View Analytics", reviewer: false, admin: true },
    { name: "Export Data", reviewer: false, admin: true },
  ];

  return (
    <div className="overflow-hidden rounded-[2px] border border-[var(--line)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--line)] bg-[var(--paper-deep)]">
            <th className="px-6 py-4 text-left font-mono text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              Feature
            </th>
            <th className="px-6 py-4 text-center font-mono text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              Reviewer
            </th>
            <th className="px-6 py-4 text-center font-mono text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              Admin
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, idx) => (
            <tr
              key={feature.name}
              onMouseEnter={() => setHoveredRow(feature.name)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`border-b border-[var(--line)] transition-all duration-200 ${
                hoveredRow === feature.name
                  ? "bg-[var(--accent-soft)]"
                  : "bg-[var(--paper)]"
              }`}
              style={{
                animation: `slideInUp 0.4s ${100 + idx * 30}ms ease-out backwards`,
              }}
            >
              <td className="px-6 py-4 font-mono text-sm text-[var(--ink)]">
                {feature.name}
              </td>
              <td className="px-6 py-4 text-center">
                {feature.reviewer ? (
                  <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                ) : (
                  <span className="text-[var(--muted)]">—</span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                {feature.admin ? (
                  <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                ) : (
                  <span className="text-[var(--muted)]">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================ */
/* Interactive Demo Section */
/* ============================================================ */

function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<"context" | "ratings" | "memory">(
    "context",
  );
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const tabs = [
    { id: "context" as const, label: "Context", icon: "📍" },
    { id: "ratings" as const, label: "Ratings", icon: "⭐" },
    { id: "memory" as const, label: "Memory", icon: "💭" },
  ];

  return (
    <div className="rounded-[2px] border border-[var(--line)] bg-[var(--paper)] overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[var(--line)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 font-mono text-xs font-bold uppercase transition-all duration-300 ${
              activeTab === tab.id
                ? "border-b-2 border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)]"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {activeTab === "context" && (
          <div className="space-y-4 animate-fadeIn">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
              Step 1 of 6
            </p>
            <h4 className="font-serif text-xl font-bold text-[var(--ink)]">
              How do you know Basit?
            </h4>
            <div className="space-y-3">
              <button className="w-full rounded-[2px] border border-[var(--line)] bg-white p-4 text-left font-mono text-sm transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]">
                📚 From a class or course
              </button>
              <button className="w-full rounded-[2px] border border-[var(--line)] bg-white p-4 text-left font-mono text-sm transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]">
                🛠️ From a project or team
              </button>
              <button className="w-full rounded-[2px] border border-[var(--line)] bg-white p-4 text-left font-mono text-sm transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]">
                💬 From casual conversation
              </button>
            </div>
          </div>
        )}

        {activeTab === "ratings" && (
          <div className="space-y-6 animate-fadeIn">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
              Step 2 of 6
            </p>
            <h4 className="font-serif text-xl font-bold text-[var(--ink)]">
              Rate across key dimensions
            </h4>
            <div className="space-y-4">
              {["Communication", "Reliability", "Creativity"].map(
                (category) => (
                  <div key={category} className="space-y-2">
                    <label className="font-mono text-xs font-bold uppercase text-[var(--ink)]">
                      {category}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onMouseEnter={() => setHoveredRating(rating)}
                          onMouseLeave={() => setHoveredRating(null)}
                          className={`h-10 w-10 rounded-[2px] border transition-all duration-300 ${
                            hoveredRating && hoveredRating >= rating
                              ? "border-[var(--accent)] bg-[var(--accent)] text-white scale-110"
                              : "border-[var(--line)] bg-white text-[var(--muted)]"
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {activeTab === "memory" && (
          <div className="space-y-4 animate-fadeIn">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
              Step 4 of 6
            </p>
            <h4 className="font-serif text-xl font-bold text-[var(--ink)]">
              Share a specific memory
            </h4>
            <textarea
              placeholder="A moment that stood out. A conversation that mattered. Something you won't forget..."
              className="w-full min-h-24 rounded-[2px] border border-[var(--line)] bg-white p-4 font-serif text-sm text-[var(--ink)] placeholder-[var(--muted)] transition-all duration-300 focus:border-[var(--accent)] focus:bg-[var(--accent-soft)] focus:outline-none"
            />
            <p className="text-xs text-[var(--muted)]">
              Specific and vivid memories make the best feedback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================ */
/* Main Page */
/* ============================================================ */

export default function HowToUsePage() {
  const [reviewerState, setReviewerState] = useState<StepState>({
    expandedStep: null,
    hoveredCard: null,
  });

  const [adminState, setAdminState] = useState<StepState>({
    expandedStep: null,
    hoveredCard: null,
  });

  return (
    <main className="mirror-grid min-h-screen bg-[var(--paper)]">
      <Header variant="public-home" />

      {/* Hero Section */}
      <section className="border-b border-[var(--line)] bg-gradient-to-b from-[var(--paper)] via-[var(--accent-soft)]/30 to-[var(--paper)]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-32">
          <div className="max-w-3xl">
            <p
              className="eyebrow mb-6 text-[var(--accent)]"
              style={{ animation: "fadeIn 0.6s ease-out" }}
            >
              HOW TO USE MIRROR
            </p>
            <h1
              className="display max-w-4xl text-[clamp(3rem,10vw,5.5rem)] leading-[0.95]"
              style={{ animation: "slideInUp 0.6s 100ms ease-out backwards" }}
            >
              Two paths.
              <br />
              One archive.
            </h1>
            <p
              className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-[var(--muted)]"
              style={{ animation: "slideInUp 0.6s 200ms ease-out backwards" }}
            >
              Whether you&apos;re sharing your perspective or archiving
              feedback, Mirror guides you through a thoughtful, structured
              process. Explore how reviewers and administrators each experience
              the system.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
            Core Capabilities
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Users}
              title="Private Accounts"
              description="Secure registration with role-based access. Only administrators see the full archive."
              index={0}
            />
            <FeatureCard
              icon={MessageSquare}
              title="Structured Feedback"
              description="Six-step process covering context, ratings, traits, memories, advice, and feeling."
              index={1}
            />
            <FeatureCard
              icon={Clock}
              title="Version History"
              description="Update your perspective anytime. All versions preserved. Archive grows over time."
              index={2}
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics & Insights"
              description="View ratings, patterns, and trends across all feedback. Export for archiving."
              index={3}
            />
          </div>
        </div>
      </section>

      {/* Reviewer Path */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-28">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-[2px] bg-[var(--accent-soft)] px-3 py-2">
              <Users className="h-4 w-4 text-[var(--accent)]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                For Reviewers
              </span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-[var(--ink)]">
              Share Your Perspective
            </h2>
            <p className="mt-4 max-w-2xl font-serif text-lg text-[var(--muted)]">
              A six-step reflection that evolves over time. Your honest
              observations become part of a permanent, private archive.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-12">
            {reviewSteps.map((step, idx) => (
              <InteractiveStepCard
                key={step.num}
                step={step}
                index={idx}
                isExpanded={reviewerState.expandedStep === idx}
                onToggle={() =>
                  setReviewerState((prev) => ({
                    ...prev,
                    expandedStep: prev.expandedStep === idx ? null : idx,
                  }))
                }
              />
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/register"
            className="group inline-flex items-center gap-3 rounded-[2px] bg-[var(--accent)] px-8 py-4 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[var(--accent-hover)] hover:shadow-lg active:scale-[0.98]"
          >
            Get Started as Reviewer
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Admin Path */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-28">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-[2px] bg-[var(--accent-soft)] px-3 py-2">
              <Shield className="h-4 w-4 text-[var(--accent)]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                For Administrators
              </span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-[var(--ink)]">
              Archive & Reflect
            </h2>
            <p className="mt-4 max-w-2xl font-serif text-lg text-[var(--muted)]">
              Protected access to all perspectives. View patterns, respond
              thoughtfully, and maintain a complete record of how others
              experience you.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-12">
            {adminSteps.map((step, idx) => (
              <InteractiveStepCard
                key={step.num}
                step={step}
                index={idx}
                isExpanded={adminState.expandedStep === idx}
                onToggle={() =>
                  setAdminState((prev) => ({
                    ...prev,
                    expandedStep: prev.expandedStep === idx ? null : idx,
                  }))
                }
              />
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/admin-login"
            className="group inline-flex items-center gap-3 rounded-[2px] bg-[var(--accent)] px-8 py-4 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[var(--accent-hover)] hover:shadow-lg active:scale-[0.98]"
          >
            Admin Access
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-28">
          <div className="mb-12">
            <h2 className="font-serif text-4xl font-bold text-[var(--ink)]">
              Try the Flow
            </h2>
            <p className="mt-4 max-w-2xl font-serif text-lg text-[var(--muted)]">
              Explore the review composer interface. Click through the tabs to
              see how each step guides you through the reflection process.
            </p>
          </div>

          <InteractiveDemo />
        </div>
      </section>

      {/* Comparison */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-28">
          <div className="mb-12">
            <h2 className="font-serif text-4xl font-bold text-[var(--ink)]">
              Feature Comparison
            </h2>
            <p className="mt-4 max-w-2xl font-serif text-lg text-[var(--muted)]">
              Different roles, different access. Hover over each row to see what
              reviewers and administrators can do.
            </p>
          </div>

          <ComparisonTable />
        </div>
      </section>

      {/* Design Principles */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-28">
          <h2 className="font-serif text-4xl font-bold text-[var(--ink)] mb-12">
            Design Principles
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "Thoughtful, Not Transactional",
                desc: "Every interaction is designed to encourage reflection and honesty.",
              },
              {
                title: "Private & Secure",
                desc: "Your feedback is protected. Only the recipient and administrators have access.",
              },
              {
                title: "Structured Guidance",
                desc: "Six steps ensure feedback is specific, actionable, and meaningful.",
              },
              {
                title: "Permanent Archive",
                desc: "All versions preserved forever. Watch how perspectives evolve over time.",
              },
              {
                title: "Editorial Aesthetic",
                desc: "Clean, calm interface. No distractions. Space for thinking.",
              },
              {
                title: "Version Control",
                desc: "Update anytime. History preserved. Timeline visible. Growth tracked.",
              },
            ].map((principle, idx) => (
              <div
                key={principle.title}
                className="rounded-[2px] border border-[var(--line)] bg-[var(--paper)] p-6 transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                style={{
                  animation: `fadeIn 0.6s ${300 + idx * 100}ms ease-out backwards`,
                }}
              >
                <h3 className="font-serif text-lg font-bold text-[var(--ink)]">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-28">
          <div className="rounded-[2px] border border-[var(--line)] bg-gradient-to-br from-[var(--accent-soft)] to-[var(--paper)] p-12 text-center">
            <h2 className="font-serif text-4xl font-bold text-[var(--ink)]">
              Ready to begin?
            </h2>
            <p className="mt-4 font-serif text-lg text-[var(--muted)]">
              Choose your path. Share your perspective or review the archive.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-[2px] bg-[var(--accent)] px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[var(--accent-hover)] hover:shadow-lg"
              >
                <Users className="h-4 w-4" />
                Reviewer Sign Up
              </Link>
              <Link
                href="/admin-login"
                className="group inline-flex items-center justify-center gap-2 rounded-[2px] border-2 border-[var(--accent)] px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)] transition-all duration-300 hover:border-[var(--accent-hover)] hover:bg-[var(--accent-soft)]"
              >
                <Shield className="h-4 w-4" />
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Interactive element transitions */
        button, a {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Focus states for accessibility */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 4px;
        }
      `}</style>
    </main>
  );
}
