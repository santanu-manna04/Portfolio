import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Linkedin, Github, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import useStaticData from '../hooks/useStaticData';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { defaultProfile } from '../data/defaults';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  useDocumentMeta('Contact', 'Get in touch with Santanu Manna about backend development work.');
  const { data: profile } = useStaticData(defaultProfile);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ mode: 'onTouched' });

  const onSubmit = async (values) => {
    if (!profile.email) return toast.error('Add your email address in src/data/defaults.js first.');
    const body = `Name: ${values.name}\nReply email: ${values.email}\n\n${values.message}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    reset();
  };

  const field = (name, label, rules, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {props.as === 'textarea'
        ? <textarea id={name} rows={6} aria-invalid={!!errors[name]} {...register(name, rules)} />
        : <input id={name} type={props.type || 'text'} aria-invalid={!!errors[name]} {...register(name, rules)} />}
      {errors[name] && <span className="error" role="alert">{errors[name].message}</span>}
    </div>
  );

  return (
    <div className="container section">
      <SectionHeading title="Contact" subtitle="Have a project, an opportunity or a question? Send me a message." />
      <div className="grid contact">
        <div className="card glass">
          {sent ? (
            <motion.div className="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <CheckCircle2 size={56} aria-hidden="true" />
              <h3>Email draft ready</h3>
              <p className="muted">Your email app should open with the message ready to review and send.</p>
              <button className="btn btn-ghost" onClick={() => setSent(false)}>Send another message</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {field('name', 'Name', { required: 'Enter your name', minLength: { value: 2, message: 'Name is too short' }, maxLength: { value: 80, message: 'Name is too long' } })}
              {field('email', 'Email', { required: 'Enter your email', pattern: { value: emailRe, message: 'Enter a valid email address' } }, { type: 'email' })}
              {field('subject', 'Subject', { required: 'Enter a subject', minLength: { value: 3, message: 'Subject is too short' }, maxLength: { value: 120, message: 'Subject is too long' } })}
              {field('message', 'Message', { required: 'Enter a message', minLength: { value: 10, message: 'Message must be at least 10 characters' }, maxLength: { value: 2000, message: 'Message is too long' } }, { as: 'textarea' })}
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="spin" size={18} /> Preparing…</> : 'Open Email App'}
              </button>
            </form>
          )}
        </div>
        <aside className="card glass info">
          <h3>Contact information</h3>
          <ul className="plain">
            {profile.email && <li><Mail size={18} /> <a href={`mailto:${profile.email}`}>{profile.email}</a></li>}
            {profile.linkedin && <li><Linkedin size={18} /> <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn profile</a></li>}
            {profile.github && <li><Github size={18} /> <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub profile</a></li>}
            <li><MapPin size={18} /> {profile.location}</li>
          </ul>
          <p className="muted">I am open to internships, junior backend roles and freelance API work. Thanks for stopping by.</p>
        </aside>
      </div>
    </div>
  );
}
