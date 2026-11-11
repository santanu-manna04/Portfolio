// Turns a stored upload path (e.g. "uploads/projects/abc.png") into a URL the browser can load.
export const fileUrl = (p) => (p ? `${import.meta.env.VITE_API_URL || ''}/${String(p).replace(/^\/+/, '')}` : '');
