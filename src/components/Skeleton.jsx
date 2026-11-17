export default function Skeleton({ count = 3, height = 180 }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => <div key={i} className="skeleton" style={{ height }} />)}
    </div>
  );
}
