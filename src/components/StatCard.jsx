export default function StatCard({ label, value, icon: Icon, tone = 'indigo' }) {
    return (
        <div className="card card-hover stat-card">
            <div>
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
            </div>
            {Icon ? (
                <div className={`stat-icon ${tone}`} aria-hidden="true">
                    <Icon size={20} />
                </div>
            ) : null}
        </div>
    );
}