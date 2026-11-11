import { useState } from 'react';
import { Code2, Server, Database, Wrench, Layout } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import FilterBar from '../components/FilterBar';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Reveal from '../components/Reveal';
import useApi from '../hooks/useApi';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { defaultSkills, skillCategories } from '../data/defaults';

const icons = { 'Programming Languages': Code2, 'Backend Development': Server, Database, Tools: Wrench, Frontend: Layout };

export default function Skills() {
  useDocumentMeta('Skills', 'Languages, backend technologies, databases and tools I work with.');
  const { data, loading } = useApi('/skills', defaultSkills);
  const [cat, setCat] = useState('All');
  const skills = (data || []).filter((s) => cat === 'All' || s.category === cat);

  return (
    <div className="container section">
      <SectionHeading title="Skills" subtitle="Technologies I use, grouped by area." />
      <FilterBar label="Skill categories" options={['All', ...skillCategories]} value={cat} onChange={setCat} />
      {loading ? <Skeleton count={6} height={110} /> : skills.length === 0 ? (
        <EmptyState title="No skills in this category" text="Choose another category to see more." />
      ) : (
        <div className="grid skills">
          {skills.map((s, i) => {
            const Icon = icons[s.category] || Code2;
            return (
              <Reveal key={s._id} delay={Math.min(i, 8) * 0.03} className="card glass skill">
                <div className="skill-head"><Icon size={20} aria-hidden="true" /><h3>{s.name}</h3></div>
                <p className="muted">{s.category}</p>
                {typeof s.level === 'number' && (
                  <div className="bar" role="progressbar" aria-valuenow={s.level} aria-valuemin={0} aria-valuemax={100} aria-label={`${s.name} proficiency`}>
                    <span style={{ width: `${s.level}%` }} />
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
