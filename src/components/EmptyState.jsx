export default function EmptyState({ icon: Icon, title, text, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      {Icon ? (
        <div className="empty-icon">
          <Icon size={26} aria-hidden="true" />
        </div>
      ) : null}
      <h3 className="empty-title">{title}</h3>
      <p className="empty-text">{text}</p>
      {actionLabel && onAction ? (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}