import "./Divider.css";

export default function Divider() {
  return (
    <div className="divider" role="separator" aria-hidden="true">
      <span className="divider__line" />
    </div>
  );
}