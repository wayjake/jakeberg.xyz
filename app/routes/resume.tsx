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
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap" },
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bonheur+Royale&display=swap" }
  ];
}

export default function Resume() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="leading-relaxed min-h-screen" style={{
      backgroundColor: '#ffffff',
      color: '#1f2937',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }}>
      {/* 📥 Download bar - your PDF generator awaits! */}
      <div className="print:hidden" style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-sm" style={{ color: '#4b5563' }}>
            Jake Berg - Resume
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: '#111827', color: '#ffffff' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#111827'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 print:shadow-none shadow-lg" style={{ backgroundColor: '#ffffff' }}>
        {/* Header */}
        <header className="pb-2 mb-4">
          <div className="flex justify-between items-start">
            <div className="w-1/2">
              <h1 className="text-3xl font-bold" style={{ color: '#111827', fontFamily: "'Bonheur Royale', cursive" }}>Jake Berg</h1>
              <p className="text-xs italic mt-2" style={{ color: '#4b5563' }}>
                Fractional CTO helping startups scale through technical strategy, architecture reviews, code audits, and team development.
              </p>
            </div>
            <div className="text-xs w-1/2 text-right" style={{ color: '#4b5563' }}>
              <span>818.688.1287</span> | <span>jake@dubsado.com</span> | <span>Burbank, CA</span>
            </div>
          </div>
        </header>

        {/* Experience Section */}
        <section className="mb-4">
          <h2 className="text-xl mb-3 pb-1" style={{ color: '#111827', borderBottom: '1px solid #d1d5db', fontFamily: "'DM Serif Text', serif" }}>Experience</h2>

          {/* Fractional CTO */}
          <div className="mb-3">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div>
                  <span className="text-[15px] font-medium" style={{ color: '#111827', fontFamily: "'DM Serif Text', serif" }}>Independent Consultant</span>
                  <span className="text-xs italic ml-2" style={{ color: '#4b5563' }}>CTO</span>
                </div>
              </div>
              <div className="text-right text-xs" style={{ color: '#4b5563' }}>
                <p>Oct 2024 – Present</p>
              </div>
            </div>
            <p className="text-xs leading-tight" style={{ color: '#1f2937' }}>
              Advised founders and startups on system scalability and architecture through technical consultations.
              Conducted stack assessments, code reviews, and architecture analysis to identify risks, improve reliability,
              and align technical decisions with business goals.
            </p>
          </div>

          {/* Dubsado CTO */}
          <div className="mb-3">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div>
                  <span className="text-[15px] font-medium" style={{ color: '#111827', fontFamily: "'DM Serif Text', serif" }}>Dubsado</span>
                  <span className="text-xs italic ml-2" style={{ color: '#4b5563' }}>CTO</span>
                </div>
              </div>
              <div className="text-right text-xs" style={{ color: '#4b5563' }}>
                <p>10/2022 - 10/2024</p>
              </div>
            </div>
            <p className="text-xs leading-tight" style={{ color: '#1f2937' }}>
              Improved cross-team developer workflow by streamlining complex nested branching strategies into a single
              staging-to-production environment. Over six months, reduced self-induced incident rate from about 60% two
              years ago to less than 5% over the last three months. Successfully delivered essential client-facing features
              within a complex legacy codebase while simultaneously maintaining agile development on new greenfield products.
              Facilitated a complete migration from DigitalOcean to Google Cloud.
            </p>
          </div>

          {/* Social Curator CTO */}
          <div className="mb-3">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div>
                  <span className="text-[15px] font-medium" style={{ color: '#111827', fontFamily: "'DM Serif Text', serif" }}>Social Curator</span>
                  <span className="text-xs italic ml-2" style={{ color: '#4b5563' }}>CTO</span>
                </div>
              </div>
              <div className="text-right text-xs" style={{ color: '#4b5563' }}>
                <p>03/2020 - 11/2022</p>
              </div>
            </div>
            <p className="text-xs leading-tight" style={{ color: '#1f2937' }}>
              Resolved major scaling issues with WordPress site by moving SQL database to GCP and leveraging self-healing
              VM instances. Decoupled PHP runtime from on-disk sessions using Redis for multi-instance sharing. Successfully
              launched product without downtime, maintaining costs on par with WP Engine. Implemented quality-of-life features
              in legacy codebase before deploying real-time swap to new React/Firebase codebase. <strong>Technologies:</strong> React,
              Node.js, Firebase, React Native, GCP.
            </p>
          </div>

          {/* Dubsado Co-Founder */}
          <div className="mb-3">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div>
                  <span className="text-[15px] font-medium" style={{ color: '#111827', fontFamily: "'DM Serif Text', serif" }}>Dubsado</span>
                  <span className="text-xs italic ml-2" style={{ color: '#4b5563' }}>Technical Co-Founder</span>
                </div>
              </div>
              <div className="text-right text-xs" style={{ color: '#4b5563' }}>
                <p>02/2015 - 10/2024</p>
              </div>
            </div>
            <p className="text-xs leading-tight" style={{ color: '#1f2937' }}>
              Bootstrapped a CRM with my wife using a pile of JavaScript books. Grew the company from $0 to $8M ARR in five years.
              Currently holding the Engineering Manager position. <strong>Technologies:</strong> Node.js, CD/CI, TypeScript, REST,
              GraphQL, MongoDB, Terraform, GCP.
            </p>
          </div>

          {/* RoboLike */}
          <div className="mb-3">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div>
                  <span className="text-[15px] font-medium" style={{ color: '#111827', fontFamily: "'DM Serif Text', serif" }}>RoboLike</span>
                  <span className="text-xs italic ml-2" style={{ color: '#4b5563' }}>Owner and Operator</span>
                </div>
              </div>
              <div className="text-right text-xs" style={{ color: '#4b5563' }}>
                <p>03/2014 - 01/2019</p>
              </div>
            </div>
            <p className="text-xs leading-tight" style={{ color: '#1f2937' }}>
              Grew to 15,000 users at its peak and served over 100,000 separate accounts over five years. Developed using the
              CakePHP framework (self-taught). Wrote a streaming transparent proxy from scratch in Node.js, replacing a middleman—including
              the logo from the target site—without client or server awareness. Maintained a clear budget; identified and halted a
              production issue caused by a contractor's code that saved the company over six figures in one day.
            </p>
          </div>

          {/* Skybolt */}
          <div className="mb-3">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div>
                  <span className="text-[15px] font-medium" style={{ color: '#111827', fontFamily: "'DM Serif Text', serif" }}>Skybolt</span>
                  <span className="text-xs italic ml-2" style={{ color: '#4b5563' }}>Contract Software Developer</span>
                </div>
              </div>
              <div className="text-right text-xs" style={{ color: '#4b5563' }}>
                <p>01/2012 - 10/2017</p>
              </div>
            </div>
            <p className="text-xs leading-tight" style={{ color: '#1f2937' }}>
              Reduced repetitive human tasks via automated cron jobs in PHP, saving the company 15% in recurring labor expenses.
              Enhanced a legacy Perl codebase to add quality-of-life improvements for existing users. Managed uptime for legacy
              systems with cloud server companies. Hired a new lead engineer and handed off full control after fully migrating
              to the new Firebase/React codebase.
            </p>
          </div>
        </section>

        {/* Skills and Education Section */}
        <section className="mb-4">
          <div className="flex gap-6">
            {/* Skills Column (2/3) */}
            <div className="w-2/3">
              <h2 className="text-xl mb-2 pb-1" style={{ color: '#111827', borderBottom: '1px solid #d1d5db', fontFamily: "'DM Serif Text', serif" }}>Skills</h2>
              <p className="text-xs leading-tight" style={{ color: '#1f2937' }}>
                <strong>Cloud & Infrastructure:</strong> GCP, Vercel, Docker, CI/CD pipelines, observability & monitoring, performance optimization, cost planning<br/>
                <strong>Backend:</strong> Node.js, TypeScript, GraphQL, REST APIs, MongoDB, PostgreSQL, Redis<br/>
                <strong>Frontend:</strong> React, Remix, Next.js, React Native, iOS/Android native development, responsive design<br/>
                <strong>Engineering Leadership:</strong> Hiring & building high-performing teams, system architecture design, database migrations, scaling strategies, code review processes, mentoring developers, Agile/Scrum methodologies
              </p>
            </div>

            {/* Education Column (1/3) */}
            <div className="w-1/3">
              <h2 className="text-xl mb-2 pb-1" style={{ color: '#111827', borderBottom: '1px solid #d1d5db', fontFamily: "'DM Serif Text', serif" }}>Education</h2>
              <p className="text-xs leading-tight" style={{ color: '#1f2937' }}>
                Computer Science coursework at University of San Diego, Pasadena City College, and Santa Barbara City College.
                Focus on data structures, algorithms, test-driven development, and full-stack programming.
                Self-taught through real-world projects and continuous learning via Egghead.io, Educative, and Frontend Masters.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}