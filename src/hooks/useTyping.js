import { useEffect, useState } from 'react';

export default function useTyping(words, speed = 85, pause = 1400) {
  const [text, setText] = useState('');
  const [i, setI] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) return undefined;
    const word = words[i % words.length];
    let t;
    if (!deleting && text === word) t = setTimeout(() => setDeleting(true), pause);
    else if (deleting && text === '') { setDeleting(false); setI((n) => n + 1); }
    else t = setTimeout(() => setText(word.slice(0, text.length + (deleting ? -1 : 1))), deleting ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [text, deleting, i, words, speed, pause, reduced]);

  return reduced ? words[0] : text;
}
