export default function SectionHeading({ title, subtitle }) {
  return (
    <header className="section-heading">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}
