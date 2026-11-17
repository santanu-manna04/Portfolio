export default function FilterBar({ options, value, onChange, label }) {
  return (
    <div className="filters" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o} type="button" className={`chip ${value === o ? 'active' : ''}`} aria-pressed={value === o} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}
