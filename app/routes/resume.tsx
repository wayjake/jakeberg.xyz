import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "../utils";
import type { Route } from "./+types/resume";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Jake Berg - Resume" },
    { name: "description", content: "Jake Berg's professional resume - Fractional CTO services" }
  ];
}

export function links() {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap" }
  ];
}

// Scoped to this page so printing a blog post keeps the browser defaults
const printStyles = `
  @page { size: letter; margin: 0.3in 0.45in; }
  @media print {
    .resume { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

type Stint = {
  title: string;
  start: string;
  end: string;
  summary?: ReactNode;
  technologies?: string[];
};

type Role = Stint & {
  company: string;
  // Titles held later at the same company, shown under the first in the order they happened
  laterRoles?: Stint[];
};

// Pulls the concrete numbers forward so they catch a skimming eye
function Highlight({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-stone-900">{children}</strong>;
}

const roles: Role[] = [
  {
    company: "Independent",
    title: "Fractional CTO & Principal Engineer",
    start: "Oct 2024",
    end: "Present",
    summary: (
      <>
        Built interactive interfaces for various clients in the medical space using AI-driven development (Claude
        Code). Advised founders and startups on system scalability and architecture
        through stack assessments, code reviews, and architecture analysis to identify risks, improve reliability,
        and align technical decisions with business goals.
      </>
    ),
  },
  {
    company: "Dubsado",
    title: "Technical Co-Founder",
    start: "Feb 2015",
    end: "Present",
    summary: (
      <>
        Bootstrapped a CRM with my wife using a pile of JavaScript books. Grew the company from{" "}
        <Highlight>$0 to $8M ARR</Highlight> in five years. Evolved into the Engineering Manager role.
      </>
    ),
    laterRoles: [
      {
        title: "CTO",
        start: "Oct 2022",
        end: "Oct 2024",
        summary: (
          <>
            Improved cross-team developer workflow by streamlining complex nested branching strategies into a single
            staging-to-production environment. Over six months, reduced self-induced incident rate from{" "}
            <Highlight>about 60%</Highlight> two years ago to <Highlight>less than 5%</Highlight> over the last three
            months. Successfully delivered essential client-facing features within a complex legacy codebase while
            simultaneously maintaining agile development on new greenfield products. Facilitated a complete migration
            from DigitalOcean to Google Cloud.
          </>
        ),
        technologies: ["Node.js", "CI/CD", "TypeScript", "REST", "GraphQL", "MongoDB", "Terraform", "GCP"],
      },
      { title: "Operations", start: "Oct 2024", end: "Aug 2026" },
      { title: "Growth", start: "Aug 2026", end: "Present" },
    ],
  },
  {
    company: "Social Curator",
    title: "Fractional CTO",
    start: "Mar 2020",
    end: "Nov 2022",
    summary: (
      <>
        Resolved major scaling issues with WordPress site by moving SQL database to GCP and leveraging self-healing
        VM instances. Decoupled PHP runtime from on-disk sessions using Redis for multi-instance sharing. Successfully
        launched product <Highlight>without downtime</Highlight>, maintaining costs on par with WP Engine. Implemented
        quality-of-life features in legacy codebase before deploying real-time swap to new React/Firebase codebase.
        Hired a full in-house development team on behalf of the client, then handed off to their new team lead.
      </>
    ),
    technologies: ["React", "Node.js", "Firebase", "React Native", "GCP"],
  },
  {
    company: "RoboLike",
    title: "Owner and Operator",
    start: "Mar 2014",
    end: "Jan 2019",
    summary: (
      <>
        Grew to <Highlight>15,000 users</Highlight> at its peak and served over{" "}
        <Highlight>100,000 separate accounts</Highlight> over five years. Developed using the CakePHP framework
        (self-taught). Wrote a streaming transparent proxy from scratch in Node.js, replacing a middleman—including the
        logo from the target site—without client or server awareness. Maintained a clear budget; identified and halted
        a production issue caused by a contractor’s code that saved the company over <Highlight>six figures</Highlight>{" "}
        in one day.
      </>
    ),
  },
  {
    company: "Skybolt",
    title: "Contract Software Developer",
    start: "Jan 2012",
    end: "Oct 2017",
    summary: (
      <>
        Reduced repetitive human tasks via automated cron jobs in PHP, saving the company{" "}
        <Highlight>15%</Highlight> in recurring labor expenses. Enhanced a legacy Perl codebase to add quality-of-life
        improvements for existing users. Managed uptime for legacy systems with cloud server companies. Hired a new lead
        engineer and handed off full control after fully migrating to the new Firebase/React codebase.
      </>
    ),
  },
];

const skills = [
  {
    label: "Cloud & Infrastructure",
    items: "GCP, Vercel, Docker, CI/CD pipelines, observability & monitoring, performance optimization, cost planning",
  },
  {
    label: "Backend",
    items: "Node.js, TypeScript, GraphQL, REST APIs, MongoDB, PostgreSQL, Redis",
  },
  {
    label: "Frontend",
    items: "React, Remix, Next.js, React Native, iOS/Android native development, responsive design",
  },
  {
    label: "Engineering Leadership",
    items:
      "Hiring & building high-performing teams, system architecture design, database migrations, scaling strategies, code review processes, mentoring developers, Agile/Scrum methodologies",
  },
];

function LaterTitle({ title }: { title: string }) {
  return (
    <span className="mr-2 text-[0.6875rem] font-medium tracking-[0.14em] text-wine uppercase print:text-[0.625rem]">
      <span aria-hidden="true">→ </span>
      {title}
    </span>
  );
}

// The date/label gutter every section lines up on
const gutter = "sm:grid sm:grid-cols-[6.25rem_1fr] sm:gap-x-7 print:grid-cols-[4.5rem_1fr] print:gap-x-5";

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-4 font-display text-[1.5rem] leading-none font-medium text-stone-900 italic print:mb-2 print:text-[1.15rem]">
      {children}
      <span aria-hidden="true" className="h-px flex-1 bg-stone-300" />
    </h2>
  );
}

export default function Resume() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume min-h-dvh bg-[#eeeae3] pb-16 text-stone-600 antialiased print:bg-white print:pb-0">
      <style>{printStyles}</style>

      <nav className="mx-auto flex max-w-[52rem] items-center justify-between px-5 py-5 sm:px-0 print:hidden">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-sm text-sm text-stone-500 transition-colors hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
        >
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
          jakeberg.xyz
        </Link>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-stone-50 shadow-sm shadow-stone-900/20 transition duration-200 hover:bg-wine active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
      </nav>

      <main className="mx-auto max-w-[52rem] bg-paper px-6 py-10 shadow-[0_1px_2px_rgb(68_64_60/0.06),0_24px_48px_-24px_rgb(68_64_60/0.28)] ring-1 ring-stone-900/5 sm:px-14 sm:py-14 print:max-w-none print:bg-white print:p-0 print:shadow-none print:ring-0">
        <header className="mb-10 print:mb-4">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-[2.875rem] leading-[0.9] font-medium tracking-[-0.015em] text-stone-900 sm:text-[3.25rem] print:text-[2.25rem]">
                Jake Berg
              </h1>
              <p className="mt-5 max-w-[33rem] font-display text-[1.15rem] leading-snug text-balance text-stone-600 italic print:mt-2.5 print:max-w-[30rem] print:leading-[1.3] print:text-[0.95rem]">
                Co-founder, CTO, and hands-on engineer helping startups build the product, scale the team, and grow the
                business.
              </p>
            </div>
            <address className="text-[0.8125rem] leading-6 text-stone-500 not-italic tabular-nums sm:shrink-0 sm:pb-1 sm:text-right print:text-[0.6875rem] print:leading-[1.1rem]">
              <a href="tel:+18186881287" className="transition-colors hover:text-wine">818.688.1287</a>
              <br />
              <a href="mailto:jake@dubsado.com" className="transition-colors hover:text-wine">jake@dubsado.com</a>
              <br />
              Burbank, CA
            </address>
          </div>
          <div aria-hidden="true" className="mt-7 border-t-2 border-stone-900 pt-[3px] print:mt-3.5">
            <div className="border-t border-stone-900" />
          </div>
        </header>

        <section className="mb-10 print:mb-4">
          <SectionHeading>Experience</SectionHeading>
          <ol>
            {roles.map((role, roleIndex) => {
              const lastRole = roleIndex === roles.length - 1;
              // Later titles with no write-up share a single line, dates inline
              const rows: Stint[][] = [];
              for (const stint of [role, ...(role.laterRoles ?? [])]) {
                const previous = rows.at(-1);
                if (!stint.summary && previous && !previous[0].summary) previous.push(stint);
                else rows.push([stint]);
              }
              return (
                <li key={role.company} className={`${gutter} break-inside-avoid`}>
                  {rows.map((row, rowIndex) => {
                    const [stint] = row;
                    const first = rowIndex === 0;
                    const lastRow = rowIndex === rows.length - 1;
                    const brief = !stint.summary;
                    return (
                      <Fragment key={stint.title}>
                        <p
                          className={cn(
                            "mb-1 text-[0.6875rem] leading-5 tracking-wide text-stone-500 tabular-nums sm:mb-0 sm:text-right print:text-[0.625rem] print:leading-4",
                            first && "sm:pt-[3px]",
                            brief && "hidden sm:block"
                          )}
                        >
                          {!brief && (
                            <>
                              {stint.start}
                              <span className="text-stone-400 sm:block"> – {stint.end}</span>
                            </>
                          )}
                        </p>
                        <div
                          className={cn(
                            "relative sm:border-l sm:border-stone-200 sm:pl-7 print:pl-5",
                            !lastRow && "pb-4 print:pb-1.5",
                            lastRow && !lastRole && "pb-7 print:pb-2.5"
                          )}
                        >
                          {/* Filled dot for joining a company, hollow for a later title there */}
                          <span
                            aria-hidden="true"
                            className={cn(
                              "absolute -left-[4px] hidden h-[7px] w-[7px] rounded-full ring-4 ring-paper sm:block print:ring-white",
                              first ? "top-[0.55rem] bg-wine" : "top-[0.45rem] border border-wine bg-paper print:top-[0.27rem] print:bg-white"
                            )}
                          />
                          {first && (
                            <h3 className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 print:mb-0.5">
                              <span className="font-display text-[1.3rem] leading-tight font-semibold text-stone-900 print:text-[1.1rem]">
                                {role.company}
                              </span>
                              <span className="text-[0.6875rem] font-medium tracking-[0.14em] text-wine uppercase print:text-[0.625rem]">
                                {stint.title}
                              </span>
                            </h3>
                          )}
                          {brief ? (
                            <p className="flex flex-wrap gap-x-6 text-[0.8125rem] leading-[1.65] print:text-[0.6875rem] print:leading-[1.42]">
                              {row.map((later) => (
                                <span key={later.title}>
                                  <LaterTitle title={later.title} />
                                  <span className="text-[0.6875rem] tracking-wide text-stone-500 tabular-nums print:text-[0.625rem]">
                                    {later.start} – {later.end}
                                  </span>
                                </span>
                              ))}
                            </p>
                          ) : (
                            <p className="text-[0.8125rem] leading-[1.65] text-pretty print:text-[0.6875rem] print:leading-[1.42]">
                              {/* A later title runs in at the start of its paragraph */}
                              {!first && <LaterTitle title={stint.title} />}
                              {stint.summary}
                            </p>
                          )}
                          {stint.technologies && (
                            <p className="mt-2 text-[0.75rem] leading-5 text-stone-500 print:mt-0.5 print:text-[0.625rem] print:leading-4">
                              <span className="mr-2 text-[0.625rem] font-medium tracking-[0.14em] text-stone-400 uppercase print:text-[0.575rem]">
                                Technologies
                              </span>
                              {stint.technologies.join(" · ")}
                            </p>
                          )}
                        </div>
                      </Fragment>
                    );
                  })}
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mb-10 break-inside-avoid print:mb-4">
          <SectionHeading>Skills</SectionHeading>
          <dl className="space-y-3 print:space-y-0.5">
            {skills.map((skill) => (
              <div key={skill.label} className={gutter}>
                <dt className="text-[0.6875rem] leading-5 font-medium tracking-wide text-stone-900 sm:pt-px sm:text-right print:text-[0.625rem] print:leading-4">
                  {skill.label}
                </dt>
                <dd className="text-[0.8125rem] leading-[1.65] text-pretty sm:pl-7 print:pl-5 print:text-[0.6875rem] print:leading-[1.42]">
                  {skill.items}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="break-inside-avoid">
          <SectionHeading>Education</SectionHeading>
          <div className={gutter}>
            <p className="text-[0.8125rem] leading-[1.65] text-pretty sm:col-start-2 sm:pl-7 print:pl-5 print:text-[0.6875rem] print:leading-[1.42]">
              Computer Science coursework at University of San Diego, Pasadena City College, and Santa Barbara City
              College. Focus on data structures, algorithms, test-driven development, and full-stack programming.
              Self-taught through real-world projects and continuous learning via Egghead.io, Educative, and Frontend
              Masters.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
