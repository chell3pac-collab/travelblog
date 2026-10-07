export default function FieldError({ error }) {
  if (!error) return null;
  const text = Array.isArray(error) ? error.join(". ") : error;
  return <p className="field-error">{text}</p>;
}
