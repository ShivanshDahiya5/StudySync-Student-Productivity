export default function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
        </div>
      </div>
      <div className="card-body">
        <div className="chart-wrap">{children}</div>
      </div>
    </div>
  );
}
