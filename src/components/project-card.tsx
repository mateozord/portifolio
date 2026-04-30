import type { Project } from "@/content/portfolio-content";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group rounded-2xl border border-white/10 bg-[#0f1530] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-400/60">
      <h3 className="text-lg font-semibold text-slate-100">{project.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-200"
          >
            {tech}
          </li>
        ))}
      </ul>
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex rounded-full border border-violet-300 px-4 py-2 text-xs font-semibold text-violet-200 transition hover:bg-violet-300 hover:text-[#0b1126]"
        >
          Ver projeto
        </a>
      ) : null}
    </article>
  );
}
