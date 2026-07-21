export default function Experience() {
  const roles = [
    {
      title: "R&D Geospatial Data Engineer II",
      org: "Oak Ridge National Laboratory",
      period: "Jan 2024 – Present",
      description:
        "Architecting fault-tolerant ETL pipelines that transform heterogeneous federal research data, spanning geospatial, environmental, and infrastructure domains, into AI-ready, queryable storage at HPC scale. Work spans the full research lifecycle, from pipeline architecture and data quality validation to the analysis and published datasets that result from it.",
      tags: ["Python", "Polars", "DuckDB", "GeoParquet", "Kubernetes", "Prefect"],
    },
    {
      title: "Mapping and Spatial Records Specialist",
      org: "NYC Department of City Planning",
      period: "Feb 2023 – Jan 2024",
      description:
        "Maintained the official City Map and Zoning Map datasets. Managed spatial data governance across 30+ city agencies, ensuring consistency and accuracy of geospatial records used in urban planning and development decisions.",
      tags: ["PostGIS", "ArcGIS", "Spatial Data Governance", "City Planning"],
    },
    {
      title: "Topographic Engineer & Planner",
      org: "Office of the Bronx Borough President",
      period: "Jun 2021 – Feb 2023",
      description:
        "Managed the Bronx Topographic Bureau per NYC Charter §82(3). Handled City Map alterations through ULURP (Uniform Land Use Review Procedure), coordinating with city agencies on topographic and boundary adjustments.",
      tags: ["Topographic Survey", "ULURP", "NYC Charter", "City Map"],
    },
  ];

  const education = [
    {
      degree: "M.S. Geoinformatics",
      school: "CUNY Hunter College",
      period: "Expected Dec 2026",
    },
    {
      degree: "B.A.",
      school: "Fordham University",
      period: "2019",
    },
  ];

  const skillGroups = [
    {
      label: "Data Infrastructure & Orchestration",
      items: ["Prefect", "Apache Airflow", "ETL/ELT Pipeline Design", "Schema Versioning"],
    },
    {
      label: "Geospatial & Analytics",
      items: ["PostGIS", "DuckDB (Spatial)", "GeoParquet", "ArcGIS", "Polars", "GeoPandas"],
    },
    {
      label: "Cloud & Systems",
      items: ["AWS S3", "Docker", "Kubernetes", "HPC"],
    },
    {
      label: "Languages & Tools",
      items: ["Python", "SQL", "Bash", "Git"],
    },
    {
      label: "Languages",
      items: ["Arabic (Intermediate)", "Spanish (Intermediate)"],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
        [ Selected Experience ]
      </p>
      <h1 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl mb-16">
        Experience
      </h1>

      <section className="mb-16">
        <h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em] mb-8">
          Work
        </h2>
        <div className="border border-border divide-y divide-border">
          {roles.map((role) => (
            <div key={role.title} className="p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-heading text-base font-bold">
                    {role.title}
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground">
                    {role.org}
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {role.period}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl">
                {role.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {role.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] uppercase tracking-widest border border-border px-2 py-0.5 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em] mb-8">
          Education
        </h2>
        <div className="border border-border divide-y divide-border">
          {education.map((edu) => (
            <div
              key={edu.degree}
              className="flex flex-wrap items-baseline justify-between gap-2 p-6"
            >
              <div>
                <p className="text-sm font-bold">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">{edu.school}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em] mb-8">
          Skills
        </h2>
        <div className="border border-border p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 gap-8">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary mb-3">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-xs uppercase tracking-widest border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em] mb-8">
          Publications &amp; Datasets
        </h2>
        <div className="border border-border divide-y divide-border">
          <div className="p-6 sm:p-8">
            <p className="text-sm font-bold mb-1">
              EAGLE-I Power Outage Data 2025
            </p>
            <p className="text-sm text-muted-foreground">
              Oak Ridge National Laboratory · Feb 2026
            </p>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-sm font-bold mb-1">
              EAGLE-I Power Outage Data 2024
            </p>
            <p className="text-sm text-muted-foreground">
              Oak Ridge National Laboratory · Apr 2025
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
