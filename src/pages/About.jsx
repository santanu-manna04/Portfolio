import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Target, Download } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import useStaticData from '../hooks/useStaticData';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { defaultAbout, defaultProfile } from '../data/defaults';
import { fileUrl } from '../services/files';

export default function About() {
  useDocumentMeta('About', 'Education, learning journey and technical interests of Santanu Manna.');
  const { data: about } = useStaticData(defaultAbout);
  const { data: profile } = useStaticData(defaultProfile);
  const [active, setActive] = useState(0);

  return (
    <div className="container section">
      <SectionHeading title="About me" subtitle={about.bio} />

      <div className="grid two">
        <Reveal className="card glass">
          <GraduationCap aria-hidden="true" />
          <h3>Education</h3>
          <p>{about.degree}</p>
          <p className="muted">{about.university}</p>
        </Reveal>
        <Reveal className="card glass" delay={0.06}>
          <Target aria-hidden="true" />
          <h3>Career goal</h3>
          <p>{about.goal}</p>
        </Reveal>
      </div>

      <h2 className="sub">My journey</h2>
      <div className="timeline" role="list">
        {about.timeline.map((t, i) => (
          <div key={t.title} role="listitem" className={`tl-item ${active === i ? 'active' : ''}`}>
            <button type="button" className="tl-btn" onClick={() => setActive(i)} aria-expanded={active === i}>{t.title}</button>
            <AnimatePresence initial={false}>
              {active === i && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="tl-text">{t.text}</motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="grid three">
        {[['Technical interests', about.interests], ['Strengths and approach', about.strengths], ['Hobbies', about.hobbies]].map(([h, list], i) => (
          <Reveal key={h} className="card glass" delay={i * 0.06}>
            <h3>{h}</h3>
            <ul className="plain">{list.map((x) => <li key={x}>{x}</li>)}</ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="card glass resume-box">
        <div><h3>Resume</h3><p className="muted">A PDF with my education, skills and projects.</p></div>
        {profile.resumeUrl ? (
          <a className="btn btn-primary" href={fileUrl(profile.resumeUrl)} download><Download size={18} /> Download resume</a>
        ) : (
          <button className="btn btn-ghost" disabled>Resume not uploaded yet</button>
        )}
      </Reveal>
    </div>
  );
}
