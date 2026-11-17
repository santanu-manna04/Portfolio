import { Inbox } from 'lucide-react';

export default function EmptyState({ title, text }) {
  return (
    <div className="empty">
      <Inbox size={36} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
