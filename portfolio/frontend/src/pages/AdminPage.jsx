import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Loader2, LogOut, Mail, Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useDocumentMeta from '../hooks/useDocumentMeta';
import api from '../services/api';
import { fileUrl } from '../services/files';

const resourceConfig = {
  projects: {
    label: 'Projects',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', kind: 'textarea', required: true },
      { name: 'technologies', label: 'Technologies', kind: 'list' },
      { name: 'features', label: 'Features', kind: 'list' },
      { name: 'categories', label: 'Categories (Backend, Full Stack, JavaScript, React)', kind: 'list' },
      { name: 'githubUrl', label: 'GitHub URL', kind: 'url' },
      { name: 'liveUrl', label: 'Live URL', kind: 'url' },
      { name: 'order', label: 'Display order', kind: 'number' },
    ],
  },
  skills: {
    label: 'Skills',
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'category', label: 'Category', kind: 'select', required: true, options: ['Programming Languages', 'Backend Development', 'Database', 'Tools', 'Frontend'] },
      { name: 'level', label: 'Level (optional, 0-100)', kind: 'number' },
      { name: 'order', label: 'Display order', kind: 'number' },
    ],
  },
  services: {
    label: 'Services',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', kind: 'textarea', required: true },
      { name: 'icon', label: 'Icon', kind: 'select', options: ['server', 'network', 'database', 'shield', 'bug', 'layers'] },
      { name: 'order', label: 'Display order', kind: 'number' },
    ],
  },
  certificates: {
    label: 'Certificates',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'organization', label: 'Organization', required: true },
      { name: 'issueDate', label: 'Issue date', kind: 'date' },
      { name: 'credentialId', label: 'Credential ID' },
      { name: 'category', label: 'Category' },
    ],
  },
};

const profileFields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'title', label: 'Professional title' },
  { name: 'intro', label: 'Introduction', kind: 'textarea' },
  { name: 'location', label: 'Location' },
  { name: 'email', label: 'Email', kind: 'email' },
  { name: 'github', label: 'GitHub URL', kind: 'url' },
  { name: 'linkedin', label: 'LinkedIn URL', kind: 'url' },
  { name: 'instagram', label: 'Instagram URL', kind: 'url' },
];
const aboutFields = [
  { name: 'bio', label: 'Biography', kind: 'textarea' },
  { name: 'degree', label: 'Degree' },
  { name: 'university', label: 'University' },
  { name: 'goal', label: 'Career goal' },
  { name: 'interests', label: 'Interests (one per line)', kind: 'list' },
  { name: 'strengths', label: 'Strengths (one per line)', kind: 'list' },
  { name: 'hobbies', label: 'Hobbies (one per line)', kind: 'list' },
];
const navigation = [
  ['overview', 'Overview'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['services', 'Services'],
  ['certificates', 'Certificates'],
  ['messages', 'Messages'],
  ['profile', 'Profile'],
];

const blankData = () => ({
  projects: [],
  skills: [],
  services: [],
  certificates: [],
  messages: [],
  profile: null,
  about: null,
});

function formValues(item, fields) {
  return Object.fromEntries(fields.map(({ name, kind }) => {
    const value = item?.[name];
    if (kind === 'list') return [name, Array.isArray(value) ? value.join('\n') : ''];
    if (kind === 'date') return [name, value ? new Date(value).toISOString().slice(0, 10) : ''];
    return [name, value == null ? '' : String(value)];
  }));
}

function requestValues(values, fields) {
  return Object.fromEntries(fields.flatMap(({ name, kind }) => {
    const value = values[name];
    if (kind === 'list') return [[name, value.split('\n').map((entry) => entry.trim()).filter(Boolean)]];
    if (kind === 'number') return value === '' ? (name === 'level' ? [[name, null]] : []) : [[name, Number(value)]];
    return value === '' ? [] : [[name, value]];
  }));
}

function EditorFields({ fields, values, onChange }) {
  return (
    <div className="admin-fields">
      {fields.map(({ name, label, kind, required, options }) => (
        <div className="field" key={name}>
          <label htmlFor={`admin-${name}`}>{label}{required ? ' *' : ''}</label>
          {kind === 'select' ? (
            <select id={`admin-${name}`} required={required} value={values[name] || ''} onChange={(event) => onChange(name, event.target.value)}>
              <option value="">Select…</option>
              {options.map((option) => <option value={option} key={option}>{option}</option>)}
            </select>
          ) : kind === 'textarea' || kind === 'list' ? (
            <textarea id={`admin-${name}`} rows={kind === 'list' ? 3 : 5} required={required} value={values[name] || ''} onChange={(event) => onChange(name, event.target.value)} />
          ) : (
            <input id={`admin-${name}`} type={kind || 'text'} required={required} min={kind === 'number' ? 0 : undefined} max={name === 'level' ? 100 : undefined} step={kind === 'number' ? 1 : undefined} value={values[name] || ''} onChange={(event) => onChange(name, event.target.value)} />
          )}
        </div>
      ))}
    </div>
  );
}

function LoginForm({ onLogin, busy }) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await onLogin(values);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to sign in. Please try again.');
    }
  };
  return (
    <main className="admin-login">
      <form className="card glass admin-login-card" onSubmit={submit}>
        <a className="admin-home-link" href="/">← Back to portfolio</a>
        <p className="admin-eyebrow">Portfolio administration</p>
        <h1>Sign in</h1>
        <p className="muted">Use the administrator account configured for this site.</p>
        <div className="field">
          <label htmlFor="admin-login-email">Email</label>
          <input id="admin-login-email" type="email" autoComplete="username" required value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="admin-login-password">Password</label>
          <input id="admin-login-password" type="password" autoComplete="current-password" required value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? <><Loader2 className="spin" size={18} /> Signing in…</> : 'Sign in'}
        </button>
      </form>
    </main>
  );
}

function ResourceManager({ resource, items, onReload }) {
  const { label, fields } = resourceConfig[resource];
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(() => formValues(null, fields));
  const [saving, setSaving] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [certificateFile, setCertificateFile] = useState(null);
  const editingItem = items.find((item) => item._id === editing);

  const startNew = () => {
    setEditing('new');
    setValues(formValues(null, fields));
    setThumbnail(null);
    setScreenshots([]);
    setCertificateFile(null);
  };
  const startEdit = (item) => {
    setEditing(item._id);
    setValues(formValues(item, fields));
    setThumbnail(null);
    setScreenshots([]);
    setCertificateFile(null);
  };
  const cancelEdit = () => {
    setEditing(null);
    setThumbnail(null);
    setScreenshots([]);
    setCertificateFile(null);
  };
  const updateValue = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const isNew = editing === 'new';
    try {
      const payload = requestValues(values, fields);
      const response = editing === 'new'
        ? await api.post(`/${resource}`, payload)
        : await api.put(`/${resource}/${editing}`, payload);
      const recordId = response.data.data._id;
      setEditing(recordId);
      if (resource === 'projects' && thumbnail) {
        const formData = new FormData();
        formData.append('file', thumbnail);
        await api.post(`/uploads/projects/${recordId}/thumbnail`, formData);
      }
      if (resource === 'projects' && screenshots.length) {
        const formData = new FormData();
        screenshots.forEach((file) => formData.append('files', file));
        await api.post(`/uploads/projects/${recordId}/screenshots`, formData);
      }
      if (resource === 'certificates' && certificateFile) {
        const formData = new FormData();
        formData.append('file', certificateFile);
        await api.post(`/uploads/certificates/${recordId}/file`, formData);
      }
      toast.success(`${label.slice(0, -1)} ${isNew ? 'created' : 'updated'}.`);
      cancelEdit();
      await onReload();
    } catch (err) {
      toast.error(err.response?.data?.message || `Could not save ${label.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };
  const removeUpload = async (url, description) => {
    if (!window.confirm(`Remove this ${description}?`)) return;
    try {
      await api.delete(url);
      toast.success(`${description[0].toUpperCase()}${description.slice(1)} removed.`);
      await onReload();
    } catch (err) {
      toast.error(err.response?.data?.message || `Could not remove ${description}.`);
    }
  };
  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.title || item.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/${resource}/${item._id}`);
      toast.success(`${label.slice(0, -1)} deleted.`);
      await onReload();
    } catch (err) {
      toast.error(err.response?.data?.message || `Could not delete ${label.toLowerCase()}.`);
    }
  };

  return (
    <>
      <div className="admin-section-heading">
        <div><h2>{label}</h2><p className="muted">Create, edit, or remove {label.toLowerCase()} displayed on the portfolio.</p></div>
        <button className="btn btn-primary sm" type="button" onClick={startNew}><Plus size={17} /> Add {label.slice(0, -1)}</button>
      </div>
      {editing !== null && (
        <form className="card glass admin-editor" onSubmit={submit}>
          <h3>{editing === 'new' ? `New ${label.slice(0, -1)}` : `Edit ${label.slice(0, -1)}`}</h3>
          <EditorFields fields={fields} values={values} onChange={updateValue} />
          {resource === 'projects' && (
            <div className="admin-upload-section">
              <h3>Project images</h3>
              <p className="muted">JPEG, PNG, or WebP; up to 8 MB each. Selected images upload when you save.</p>
              {editingItem?.thumbnail && (
                <div className="admin-upload-preview">
                  <img src={fileUrl(editingItem.thumbnail)} alt={`${editingItem.title} thumbnail`} />
                  <button className="btn btn-ghost sm admin-delete" type="button" onClick={() => removeUpload(`/uploads/projects/${editing}/thumbnail`, 'project thumbnail')}><Trash2 size={15} /> Remove thumbnail</button>
                </div>
              )}
              <div className="field">
                <label htmlFor="admin-project-thumbnail">Thumbnail image</label>
                <input id="admin-project-thumbnail" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setThumbnail(event.target.files?.[0] || null)} />
                {thumbnail && <span className="muted">{thumbnail.name}</span>}
              </div>
              {editingItem?.screenshots?.length > 0 && (
                <div className="admin-upload-gallery">
                  {editingItem.screenshots.map((image, index) => (
                    <div className="admin-upload-preview" key={`${image}-${index}`}>
                      <img src={fileUrl(image)} alt={`${editingItem.title} screenshot ${index + 1}`} />
                      <button className="btn btn-ghost sm admin-delete" type="button" onClick={() => removeUpload(`/uploads/projects/${editing}/screenshots/${index}`, 'project screenshot')}><Trash2 size={15} /> Remove</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="field">
                <label htmlFor="admin-project-screenshots">Additional images (up to 10 total)</label>
                <input id="admin-project-screenshots" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setScreenshots(Array.from(event.target.files || []))} />
                {screenshots.length > 0 && <span className="muted">{screenshots.length} image(s) selected</span>}
              </div>
            </div>
          )}
          {resource === 'certificates' && (
            <div className="admin-upload-section">
              <h3>Certificate file</h3>
              <p className="muted">Upload a PDF or JPEG, PNG, or WebP image; up to 10 MB. The selected file uploads when you save.</p>
              {editingItem?.file && (
                <div className="admin-upload-preview">
                  {editingItem.fileType === 'image'
                    ? <img src={fileUrl(editingItem.file)} alt={`${editingItem.title} certificate`} />
                    : <a className="btn btn-ghost sm" href={fileUrl(editingItem.file)} target="_blank" rel="noopener noreferrer">Open certificate PDF</a>}
                  <button className="btn btn-ghost sm admin-delete" type="button" onClick={() => removeUpload(`/uploads/certificates/${editing}/file`, 'certificate file')}><Trash2 size={15} /> Remove file</button>
                </div>
              )}
              <div className="field">
                <label htmlFor="admin-certificate-file">PDF or image</label>
                <input id="admin-certificate-file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => setCertificateFile(event.target.files?.[0] || null)} />
                {certificateFile && <span className="muted">{certificateFile.name}</span>}
              </div>
            </div>
          )}
          <div className="admin-actions">
            <button className="btn btn-primary sm" disabled={saving}>{saving ? 'Saving…' : <><Save size={16} /> Save</>}</button>
            <button className="btn btn-ghost sm" type="button" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      )}
      {items.length ? (
        <div className="admin-list">
          {items.map((item) => (
            <article className="card glass admin-item" key={item._id}>
              <div><h3>{item.title || item.name}</h3><p className="muted">{item.description || item.category || item.organization || '—'}</p></div>
              <div className="admin-actions">
                <button className="btn btn-ghost sm" type="button" onClick={() => startEdit(item)}>Edit</button>
                <button className="btn btn-ghost sm admin-delete" type="button" onClick={() => remove(item)}><Trash2 size={15} /> Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : <p className="empty">No {label.toLowerCase()} yet. Add one to get started.</p>}
    </>
  );
}

function ProfileManager({ profile, about, onReload }) {
  const [section, setSection] = useState('profile');
  const fields = section === 'profile' ? profileFields : aboutFields;
  const [values, setValues] = useState(() => formValues(section === 'profile' ? profile : about, fields));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(formValues(section === 'profile' ? profile : about, fields));
  }, [section, profile, about]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.put(section === 'profile' ? '/profile' : '/profile/about', requestValues(values, fields));
      toast.success('Profile updated.');
      await onReload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update the profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-section-heading"><div><h2>Profile</h2><p className="muted">Edit the information shown on the home and about pages.</p></div></div>
      <div className="filters" role="tablist" aria-label="Profile section">
        <button className={`chip ${section === 'profile' ? 'active' : ''}`} role="tab" aria-selected={section === 'profile'} type="button" onClick={() => setSection('profile')}>Contact and introduction</button>
        <button className={`chip ${section === 'about' ? 'active' : ''}`} role="tab" aria-selected={section === 'about'} type="button" disabled={!profile} onClick={() => setSection('about')}>About details</button>
      </div>
      {section === 'about' && !profile ? <p className="empty">Save the contact and introduction details first to create your profile.</p> : (
        <form className="card glass admin-editor" onSubmit={save}>
          <EditorFields fields={fields} values={values} onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))} />
          <button className="btn btn-primary sm" disabled={saving}>{saving ? 'Saving…' : <><Save size={16} /> Save profile</>}</button>
        </form>
      )}
      {section === 'about' && <p className="muted admin-note">Timeline entries are left unchanged here. Profile image and resume uploads will be available when upload support is added.</p>}
    </>
  );
}

function Messages({ messages, onReload }) {
  const markRead = async (item) => {
    try {
      await api.patch(`/contact/${item._id}/read`, { read: !item.read });
      await onReload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update this message.');
    }
  };
  const remove = async (item) => {
    if (!window.confirm(`Delete the message from ${item.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/contact/${item._id}`);
      toast.success('Message deleted.');
      await onReload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete this message.');
    }
  };
  return (
    <>
      <div className="admin-section-heading"><div><h2>Messages</h2><p className="muted">Messages submitted through the public contact form.</p></div></div>
      {messages.length ? <div className="admin-list">
        {messages.map((item) => (
          <article className={`card glass admin-message ${item.read ? '' : 'unread'}`} key={item._id}>
            <div className="admin-message-top"><div><h3>{item.subject}</h3><p className="muted">{item.name} · <a href={`mailto:${item.email}`}>{item.email}</a></p></div><time className="muted">{new Date(item.createdAt).toLocaleDateString()}</time></div>
            <p className="admin-message-body">{item.message}</p>
            <div className="admin-actions">
              <a className="btn btn-ghost sm" href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`}><ExternalLink size={15} /> Reply</a>
              <button className="btn btn-ghost sm" type="button" onClick={() => markRead(item)}>{item.read ? 'Mark unread' : 'Mark read'}</button>
              <button className="btn btn-ghost sm admin-delete" type="button" onClick={() => remove(item)}><Trash2 size={15} /> Delete</button>
            </div>
          </article>
        ))}
      </div> : <p className="empty">Your inbox is empty.</p>}
    </>
  );
}

export default function AdminPage() {
  useDocumentMeta('Admin');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState(blankData);
  const [dataLoading, setDataLoading] = useState(false);
  const [active, setActive] = useState('overview');

  const reload = useCallback(async () => {
    setDataLoading(true);
    try {
      const paths = ['/projects', '/skills', '/services', '/certificates', '/contact', '/profile', '/profile/about'];
      const responses = await Promise.all(paths.map((path) => api.get(path)));
      setData({
        projects: responses[0].data.data || [],
        skills: responses[1].data.data || [],
        services: responses[2].data.data || [],
        certificates: responses[3].data.data || [],
        messages: responses[4].data.data || [],
        profile: responses[5].data.data,
        about: responses[6].data.data,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        setUser(null);
        toast.error('Your session expired. Please sign in again.');
      } else {
        toast.error(err.response?.data?.message || 'Could not load admin data. Check the API connection and try again.');
      }
      throw err;
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.get('/auth/me')
      .then(({ data: response }) => {
        if (active && response.data?.role === 'admin') setUser(response.data);
      })
      .catch((err) => {
        if (active && err.response?.status !== 401) toast.error(err.response?.data?.message || 'Could not verify the admin session.');
      })
      .finally(() => active && setAuthLoading(false));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (user) reload().catch(() => {});
  }, [user, reload]);

  const login = async (credentials) => {
    setBusy(true);
    try {
      const { data: response } = await api.post('/auth/login', credentials);
      if (response.data?.role !== 'admin') throw new Error('This account does not have admin access.');
      setUser(response.data);
    } catch (err) {
      if (err.response) throw err;
      throw err;
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setBusy(true);
    try {
      await api.post('/auth/logout');
      setUser(null);
      setData(blankData());
      toast.success('Signed out.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not sign out. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (authLoading) return <main className="admin-login"><Loader2 className="spin" aria-label="Checking admin session" /></main>;
  if (!user) return <LoginForm onLogin={login} busy={busy} />;

  const unread = data.messages.filter((message) => !message.read).length;
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="brand" href="/">SM<span>.</span></a>
        <span className="admin-header-title">Admin dashboard</span>
        <div className="admin-header-actions">
          <span className="muted">{user.name}</span>
          <a className="btn btn-ghost sm" href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> View site</a>
          <button className="btn btn-ghost sm" type="button" onClick={logout} disabled={busy}><LogOut size={15} /> Sign out</button>
        </div>
      </header>
      <div className="admin-layout">
        <nav className="admin-sidebar" aria-label="Admin sections">
          {navigation.map(([id, label]) => (
            <button className={active === id ? 'active' : ''} type="button" onClick={() => setActive(id)} aria-current={active === id ? 'page' : undefined} key={id}>
              {id === 'messages' && <Mail size={17} />}
              <span>{label}</span>
              {id === 'messages' && unread > 0 && <span className="admin-badge">{unread}</span>}
            </button>
          ))}
        </nav>
        <section className="admin-content">
          <div className="admin-content-top">
            <div><p className="admin-eyebrow">Portfolio management</p><h1>{navigation.find(([id]) => id === active)?.[1]}</h1></div>
            <button className="icon-btn" type="button" onClick={() => reload().catch(() => {})} disabled={dataLoading} aria-label="Refresh admin data">
              {dataLoading ? <Loader2 className="spin" size={18} /> : <RefreshCw size={18} />}
            </button>
          </div>
          {active === 'overview' ? (
            <div className="admin-stats">
              {[
                ['Projects', data.projects.length, 'projects'],
                ['Skills', data.skills.length, 'skills'],
                ['Services', data.services.length, 'services'],
                ['Certificates', data.certificates.length, 'certificates'],
                ['Unread messages', unread, 'messages'],
              ].map(([label, count, target]) => (
                <button className="card glass admin-stat" key={label} type="button" onClick={() => setActive(target)}>
                  <span className="muted">{label}</span><strong>{count}</strong><span>Manage →</span>
                </button>
              ))}
            </div>
          ) : dataLoading && data.projects.length === 0 && data.skills.length === 0 && data.services.length === 0 && data.certificates.length === 0 ? (
            <div className="empty"><Loader2 className="spin" /> Loading admin data…</div>
          ) : active === 'messages' ? <Messages messages={data.messages} onReload={reload} />
            : active === 'profile' ? <ProfileManager profile={data.profile} about={data.about} onReload={reload} />
              : <ResourceManager resource={active} items={data[active]} onReload={reload} />}
          <p className="admin-footer-note">Protected by your admin session. Changes are saved to the portfolio API.</p>
        </section>
      </div>
    </main>
  );
}
