import { useMemo, useState } from 'react';
import { Eye, Download, FileText } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Reveal from '../components/Reveal';
import useStaticData from '../hooks/useStaticData';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { defaultCertificates } from '../data/defaults';
import { fileUrl } from '../services/files';

const isPdf = (c) => c.fileType === 'pdf' || /\.pdf$/i.test(c.file || '');
const fmt = (d) => (d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '');

export default function Certificates() {
  useDocumentMeta('Certificates', 'Courses and certifications earned by Santanu Manna.');
  const { data } = useStaticData(defaultCertificates);
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(null);

  const cats = useMemo(() => ['All', ...new Set((data || []).map((c) => c.category).filter(Boolean))], [data]);
  const list = (data || []).filter((c) => cat === 'All' || c.category === cat);

  return (
    <div className="container section">
      <SectionHeading title="Certificates" subtitle="Courses and certifications I have completed." />
      {cats.length > 2 && <FilterBar label="Certificate categories" options={cats} value={cat} onChange={setCat} />}
      {list.length === 0 ? (
        <EmptyState title="No certificates yet" text="Certificates will appear here once they are added." />
      ) : (
        <div className="grid three">
          {list.map((c, i) => (
            <Reveal key={c._id} delay={i * 0.04} className="card glass cert">
              {isPdf(c) ? <div className="thumb placeholder"><FileText size={40} aria-hidden="true" /></div>
                : c.file ? <img className="thumb" src={fileUrl(c.file)} alt={`${c.title} certificate`} loading="lazy" />
                  : <div className="thumb placeholder"><FileText size={40} aria-hidden="true" /></div>}
              <h3>{c.title}</h3>
              <p className="muted">{c.organization}{c.issueDate ? ` · ${fmt(c.issueDate)}` : ''}</p>
              {c.credentialId && <p className="muted">Credential ID: {c.credentialId}</p>}
              {c.file ? <div className="cta-row">
                <button className="btn btn-primary sm" onClick={() => setOpen(c)}><Eye size={16} /> View Certificate</button>
                <a className="btn btn-ghost sm" href={fileUrl(c.file)} download><Download size={16} /> Download</a>
              </div> : <p className="muted">Certificate file not uploaded yet.</p>}
            </Reveal>
          ))}
        </div>
      )}
      {open && (
        <Modal title={open.title} onClose={() => setOpen(null)} wide>
          {isPdf(open)
            ? <iframe className="pdf-frame" src={fileUrl(open.file)} title={open.title} />
            : <img className="lightbox-img" src={fileUrl(open.file)} alt={`${open.title} certificate`} />}
        </Modal>
      )}
    </div>
  );
}
