import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ChevronDown } from 'lucide-react';
import useApi from '../hooks/useApi';
import useTyping from '../hooks/useTyping';
import useDocumentMeta from '../hooks/useDocumentMeta';
import SocialLinks from '../components/SocialLinks';
import Reveal from '../components/Reveal';
import { defaultProfile, typingRoles } from '../data/defaults';
import { fileUrl } from '../services/files';

export default function Home() {
  const { data, loading } = useApi('/profile', defaultProfile);
  const profile = data || defaultProfile;
  const typed = useTyping(typingRoles);
  useDocumentMeta('', 'Portfolio of Santanu Manna, an aspiring backend developer working with Node.js, Express and MongoDB.');

  return (
    <>
      <section className="hero container">
        <div className="hero-text">
          <h1 className="hero-title">Hi, I'm {profile.name}.</h1>
          <p className="hero-role">{profile.title}</p>
          <p className="hero-typing" aria-live="off">
            <span className="typed">{typed}</span><span className="caret" aria-hidden="true" />
          </p>
          <p className="lead">{profile.intro}</p>
          <div className="cta-row">
            <Link className="btn btn-primary" to="/projects">View My Projects</Link>
            <Link className="btn btn-ghost" to="/contact">Contact Me</Link>
            {profile.resumeUrl ? (
              <a className="btn btn-ghost" href={fileUrl(profile.resumeUrl)} download><Download size={18} /> Download Resume</a>
            ) : (
              <button className="btn btn-ghost" disabled title="Resume has not been uploaded yet"><Download size={18} /> Download Resume</button>
            )}
          </div>
          <SocialLinks profile={profile} />
        </div>
        <motion.div className="hero-image" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <div className="gradient-ring">
            {profile.profileImage ? (
              <img src={fileUrl(profile.profileImage)} alt={`Portrait of ${profile.name}`} />
            ) : (
              <div className="avatar" role="img" aria-label={`${profile.name} initials`}>SM</div>
            )}
          </div>
        </motion.div>
        <a href="#stats" className="scroll-indicator" aria-label="Scroll to statistics"><ChevronDown size={26} /></a>
      </section>

      <section id="stats" className="container section">
        <div className="stats">
          {(loading ? defaultProfile.stats : profile.stats || defaultProfile.stats).map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="stat glass">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
