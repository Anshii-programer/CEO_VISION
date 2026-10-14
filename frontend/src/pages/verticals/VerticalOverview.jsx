const formatNumber = (value) => new Intl.NumberFormat('en-IN').format(value ?? 0);
const formatRevenue = (value) => `₹${(value / 10000000).toFixed(1)} Cr`;

export default function VerticalOverview({ title, icon, description, overview = {} }) {
  const metrics = [
    { label: 'Active clients', value: formatNumber(overview.clients), note: 'Tracked in your CRM', tone: 'blue' },
    { label: 'Open leads', value: formatNumber(overview.leads), note: 'Across all sales stages', tone: 'purple' },
    { label: 'Pipeline value', value: formatRevenue(overview.revenue ?? 0), note: 'From tracked deals', tone: 'cyan' },
    { label: 'Projects', value: formatNumber(overview.projects), note: 'In your workspace', tone: 'green' },
  ];

  return (
    <section className="vertical-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">BUSINESS WORKSPACE</p>
          <h1>{icon} {title}</h1>
          <p className="muted">{description}</p>
        </div>
        <span className="live-pill"><span /> Live CRM data</span>
      </div>
      <div className="metric-grid">
        {metrics.map((metric) => (
          <article className={`metric-card tone-${metric.tone}`} key={metric.label}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.note}</span>
          </article>
        ))}
      </div>
      <article className="panel vertical-note">
        <div className="panel-title">
          <div><p className="eyebrow">WORKSPACE SNAPSHOT</p><h2>{title} at a glance</h2></div>
          <span className="live-pill"><span /> Connected</span>
        </div>
        <p className="muted">
          These figures are calculated from your saved CRM records. Add or update clients, leads, deals,
          and projects to keep this view current.
        </p>
      </article>
    </section>
  );
}
