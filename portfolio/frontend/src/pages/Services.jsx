import { Link } from 'react-router-dom';
import { Server, Network, Database, ShieldCheck, Bug, Layers } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Skeleton from '../components/Skeleton';
import Reveal from '../components/Reveal';
import useApi from '../hooks/useApi';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { defaultServices } from '../data/defaults';

const icons = { server: Server, network: Network, database: Database, shield: ShieldCheck, bug: Bug, layers: Layers };

export default function Services() {
  useDocumentMeta('Services', 'Backend development services offered by Santanu Manna.');
  const { data, loading } = useApi('/services', defaultServices);
  return (
    <div className="container section">
      <SectionHeading title="Services" subtitle="Areas where I can help, and where I am actively building my expertise." />
      {loading ? <Skeleton count={6} height={150} /> : (
        <div className="grid three">
          {data.map((s, i) => {
            const Icon = icons[s.icon] || Server;
            return (
              <Reveal key={s._id} delay={i * 0.05} className="card glass service">
                <Icon size={28} aria-hidden="true" />
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </Reveal>
            );
          })}
        </div>
      )}
      <div className="center"><Link className="btn btn-primary" to="/contact">Contact Me</Link></div>
    </div>
  );
}
