import { useEffect } from 'react';

const setMeta = (sel, attr, key, value) => {
  let el = document.head.querySelector(sel);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', value);
};

export default function useDocumentMeta(title, description) {
  useEffect(() => {
    const full = title ? `${title} | Santanu Manna` : 'Santanu Manna | Backend Developer';
    document.title = full;
    setMeta('meta[property="og:title"]', 'property', 'og:title', full);
    if (description) {
      setMeta('meta[name="description"]', 'name', 'description', description);
      setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    }
  }, [title, description]);
}
