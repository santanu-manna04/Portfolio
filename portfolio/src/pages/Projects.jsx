import { useMemo, useState } from 'react';
import { Github, ExternalLink, Search } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Reveal from '../components/Reveal';
import useStaticData from '../hooks/useStaticData';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { defaultProjects, projectFilters } from '../data/defaults';
import { fileUrl } from '../services/files';

function Thumb({ project }) {
  return project.thumbnail
    ? <img className="thumb" src={fileUrl(project.thumbnail)} alt={`${project.title} preview`} loading="lazy" />
    : <div className="thumb placeholder" aria-hidden="true">{project.title.slice(0, 2)}</div>;
}

export default function Projects() {
  useDocumentMeta('Projects', 'Backend and full-stack projects built with Node.js, Express and MongoDB.');
  const { data } = useStaticData(defaultProjects);
  const [filter, setFilter] = useState('All Projects');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const list = useMemo(() => (data || []).filter((p) => {
    const inCat = filter === 'All Projects' || p.categories?.includes(filter);
    const text = `${p.title} ${p.description} ${p.technologies?.join(' ')}`.toLowerCase();
    return inCat && text.includes(q.trim().toLowerCase());
  }), [data, filter, q]);

  const Links = ({ p }) => (
    <>
      {p.githubUrl && <a className="btn btn-ghost sm" href={p.githubUrl} target="_blank" rel="noopener noreferrer"><Github size={16} /> GitHub</a>}
      {p.liveUrl && <a className="btn btn-ghost sm" href={p.liveUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /> Live demo</a>}
    </>
  );

  return (
    <div className="container section">
      <SectionHeading title="Projects" subtitle="Things I have built while learning backend development." />
      <div className="toolbar">
        <FilterBar label="Project categories" options={projectFilters} value={filter} onChange={setFilter} />
        <label className="search">
          <Search size={18} aria-hidden="true" />
          <input type="search" placeholder="Search projects" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search projects" />
        </label>
      </div>

      {list.length === 0 ? (
        <EmptyState title="No projects found" text="Try another category or search term." />
      ) : (
        <div className="grid two">
          {list.map((p, i) => (
            <Reveal key={p._id} delay={i * 0.05} className="card glass project">
              <Thumb project={p} />
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <ul className="tags">{p.technologies?.map((t) => <li key={t}>{t}</li>)}</ul>
              <ul className="plain features">{p.features?.map((f) => <li key={f}>{f}</li>)}</ul>
              <div className="cta-row"><Links p={p} /><button className="btn btn-primary sm" onClick={() => setSelected(p)}>View Details</button></div>
            </Reveal>
          ))}
        </div>
      )}

      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)} wide>
          <Thumb project={selected} />
          <p>{selected.description}</p>
          <ul className="tags">{selected.technologies?.map((t) => <li key={t}>{t}</li>)}</ul>
          <h3>Key features</h3>
          <ul className="plain">{selected.features?.map((f) => <li key={f}>{f}</li>)}</ul>
          {selected.screenshots?.length > 0 && (
            <>
              <h3>Screenshots</h3>
              <div className="shots">
                {selected.screenshots.map((s, i) => (
                  <button key={s} type="button" className="shot" onClick={() => setLightbox(s)} aria-label={`Open screenshot ${i + 1}`}>
                    <img src={fileUrl(s)} alt={`${selected.title} screenshot ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="cta-row">
            <Links p={selected} />
            {selected.documentation && <a className="btn btn-ghost sm" href={fileUrl(selected.documentation)} target="_blank" rel="noopener noreferrer">Documentation (PDF)</a>}
          </div>
        </Modal>
      )}
      {lightbox && (
        <Modal title="Screenshot" onClose={() => setLightbox(null)} wide>
          <img className="lightbox-img" src={fileUrl(lightbox)} alt="Project screenshot enlarged" />
        </Modal>
      )}
    </div>
  );
}
