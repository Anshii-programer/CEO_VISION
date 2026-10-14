import { useCallback, useEffect, useRef, useState } from 'react';
import EcommerceDash from './verticals/EcommerceDash';
import EducationDash from './verticals/EducationDash';
import EnterpriseDash from './verticals/EnterpriseDash';
import FinanceDash from './verticals/FinanceDash';
import HealthcareDash from './verticals/HealthcareDash';
import RealEstateDash from './verticals/RealEstateDash';
import SmallBizDash from './verticals/SmallBizDash';
import StartupDash from './verticals/StartupDash';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`;
const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: '▦' },
  { label: 'Clients', path: '/clients', icon: '♙', type: 'clients' },
  { label: 'Leads', path: '/leads', icon: '◎', type: 'leads' },
  { label: 'Projects', path: '/projects', icon: '▣', type: 'projects' },
  { label: 'Deals', path: '/deals', icon: '◇', type: 'deals' },
  { label: 'Tasks', path: '/tasks', icon: '☑', type: 'tasks' },
  { label: 'Calendar', path: '/calendar', icon: '▤', type: 'calendar' },
  { label: 'Employees', path: '/employees', icon: '♧', type: 'employees' },
  { label: 'Tickets', path: '/tickets', icon: '◈', type: 'tickets' },
  { label: 'Reports', path: '/reports', icon: '▥' },
  { label: 'Analytics', path: '/analytics', icon: '⌁' },
  { label: 'AI Assistant', path: '/assistant', icon: '✦' },
  { label: 'Notifications', path: '/notifications', icon: '♧' },
  { label: 'Settings', path: '/settings', icon: '⚙' },
];
const verticals = [
  { slug: 'enterprise', label: 'Enterprise', icon: '🏢', Component: EnterpriseDash },
  { slug: 'startup', label: 'Startup', icon: '🚀', Component: StartupDash },
  { slug: 'small-biz', label: 'Small business', icon: '🏪', Component: SmallBizDash },
  { slug: 'ecommerce', label: 'E-commerce', icon: '🛒', Component: EcommerceDash },
  { slug: 'healthcare', label: 'Healthcare', icon: '🏥', Component: HealthcareDash },
  { slug: 'education', label: 'Education', icon: '🎓', Component: EducationDash },
  { slug: 'real-estate', label: 'Real estate', icon: '🏘️', Component: RealEstateDash },
  { slug: 'finance', label: 'Finance', icon: '💳', Component: FinanceDash },
];
const titles = {
  clients: 'Clients',
  leads: 'Leads',
  projects: 'Projects',
  deals: 'Deals',
  tasks: 'Tasks',
  calendar: 'Calendar',
  employees: 'Employees',
  tickets: 'Support tickets',
};
const initialForm = { type: 'leads', name: '', company: '', detail: '', status: 'New', owner: '', value: '' };
const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
const compactMoney = (value) => `₹${(value / 10000000).toFixed(1)} Cr`;
const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '—';
const shortDate = (date) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' }).format(new Date(date));

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('ceo-vision-token') || ''}`,
      ...options?.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Request failed (${response.status}).`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function getLocation() {
  return `${window.location.pathname}${window.location.search}`;
}

export default function MainDashboard({ user, onLogout }) {
  const [location, setLocation] = useState(getLocation);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(() => localStorage.getItem('ceo-vision-workspace') || 'CEO VISION');
  const searchRef = useRef(null);

  const refreshRecords = useCallback(async () => {
    try {
      const data = await request('/records');
      if (!Array.isArray(data)) throw new Error('The server returned an invalid records response.');
      setRecords(data);
      setApiError('');
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRecords();
  }, [refreshRecords]);

  useEffect(() => {
    const updateLocation = () => {
      setLocation(getLocation());
      setSidebarOpen(false);
    };
    window.addEventListener('popstate', updateLocation);
    return () => window.removeEventListener('popstate', updateLocation);
  }, []);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const navigate = useCallback((path) => {
    if (getLocation() !== path) window.history.pushState({}, '', path);
    setLocation(path);
    setSearch('');
    setSidebarOpen(false);
  }, []);

  const pathname = location.split('?')[0].replace(/\/+$/, '') || '/';
  const activeNav = navigation.find((item) => item.path === pathname) || navigation[0];
  const activeVertical = verticals.find((item) => pathname === `/verticals/${item.slug}`);
  const sectionType = activeNav.type;
  const selectedRecords = sectionType ? records.filter((record) => record.type === sectionType) : records;
  const query = search.trim().toLowerCase();
  const pageRecords = query
    ? selectedRecords.filter((record) => [record.name, record.company, record.detail, record.status, record.owner]
      .some((value) => String(value || '').toLowerCase().includes(query)))
    : selectedRecords;
  const count = (type) => records.filter((record) => record.type === type).length;
  const overview = {
    clients: count('clients'),
    leads: count('leads'),
    projects: count('projects'),
    deals: count('deals'),
    tasks: count('tasks'),
    tickets: count('tickets'),
    revenue: records.filter((record) => record.type === 'deals').reduce((total, record) => total + Number(record.value || 0), 0),
    dueToday: records.filter((record) => record.type === 'tasks' && /today|due/i.test(record.status)).length,
    openTickets: records.filter((record) => record.type === 'tickets' && !/closed|resolved/i.test(record.status)).length,
  };

  const openCreate = (type = sectionType || 'leads') => {
    setForm({ ...initialForm, type, owner: user.name });
    setShowModal(true);
  };

  const createRecord = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await request('/records', {
        method: 'POST',
        body: JSON.stringify({ ...form, value: Number(form.value || 0) }),
      });
      await refreshRecords();
      setShowModal(false);
      setToast(`${titles[form.type] || 'Record'} added successfully.`);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (record, status) => {
    try {
      const updated = await request(`/records/${record.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setRecords((current) => current.map((item) => item.id === updated.id ? updated : item));
      setToast('Status updated.');
    } catch (error) {
      setApiError(error.message);
    }
  };

  const deleteRecord = async (record) => {
    if (!window.confirm(`Delete "${record.name}"? This cannot be undone.`)) return;
    try {
      await request(`/records/${record.id}`, { method: 'DELETE' });
      setRecords((current) => current.filter((item) => item.id !== record.id));
      setToast('Record deleted.');
    } catch (error) {
      setApiError(error.message);
    }
  };

  const downloadReport = () => {
    const rows = [['Type', 'Name', 'Company', 'Status', 'Owner', 'Value'], ...records.map((record) => [
      record.type, record.name, record.company, record.status, record.owner, record.value,
    ])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'ceo-vision-crm-report.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    setToast('CRM report downloaded.');
  };

  const saveWorkspace = (event) => {
    event.preventDefault();
    localStorage.setItem('ceo-vision-workspace', workspaceName.trim() || 'CEO VISION');
    setToast('Workspace settings saved.');
  };

  const getPageTitle = () => activeVertical?.label || activeNav.label;

  const renderDashboard = () => (
    <>
      <div className="welcome-row">
        <div><p className="eyebrow">WEDNESDAY, 14 OCTOBER 2026</p><h1>Good morning, John <span>👋</span></h1><p className="muted">Here&apos;s what&apos;s happening with your business today.</p></div>
        <button className="button button-primary" onClick={() => openCreate('leads')}>＋ <span>New record</span></button>
      </div>
      <section className="metric-grid dashboard-metrics" aria-label="CRM summary">
        <article className="metric-card tone-blue"><div className="metric-top"><span className="metric-icon">₹</span><span className="metric-trend">↗ 18.5%</span></div><p>Total revenue</p><strong>{compactMoney(overview.revenue)}</strong><span>From all active deals</span></article>
        <article className="metric-card tone-purple"><div className="metric-top"><span className="metric-icon">◇</span><span className="metric-trend">↗ 14.2%</span></div><p>Active deals</p><strong>{overview.deals}</strong><span>In the sales pipeline</span></article>
        <article className="metric-card tone-cyan"><div className="metric-top"><span className="metric-icon">◎</span><span className="metric-trend">↗ 22.6%</span></div><p>New leads</p><strong>{overview.leads}</strong><span>Ready for follow-up</span></article>
        <article className="metric-card tone-green"><div className="metric-top"><span className="metric-icon">♙</span><span className="metric-trend">↗ 9.8%</span></div><p>Total clients</p><strong>{overview.clients}</strong><span>Across your accounts</span></article>
        <article className="metric-card tone-orange"><div className="metric-top"><span className="metric-icon">◈</span><span className="metric-trend">Needs attention</span></div><p>Open tickets</p><strong>{overview.openTickets}</strong><span>Support requests</span></article>
        <article className="metric-card tone-yellow"><div className="metric-top"><span className="metric-icon">☑</span><span className="metric-trend">{overview.dueToday} due today</span></div><p>Tasks due</p><strong>{overview.tasks}</strong><span>Across your team</span></article>
      </section>

      <section className="dashboard-grid">
        <article className="panel revenue-panel">
          <div className="panel-title"><div><h2>Revenue overview</h2><p className="muted">Deal value by month</p></div><span className="period-label">This year⌄</span></div>
          <p className="chart-total">{compactMoney(overview.revenue)} <span>↗ 18.5%</span></p>
          <div className="chart-wrap">
            <div className="chart-y-labels"><span>₹30 Cr</span><span>₹20 Cr</span><span>₹10 Cr</span><span>₹0</span></div>
            <svg className="revenue-chart" viewBox="0 0 640 190" role="img" aria-label="Revenue trend increasing through the year" preserveAspectRatio="none">
              <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4385ff" stopOpacity=".34" /><stop offset="100%" stopColor="#4385ff" stopOpacity="0" /></linearGradient></defs>
              {[30, 75, 120, 165].map((y) => <line key={y} x1="0" x2="640" y1={y} y2={y} stroke="#213149" strokeDasharray="4 7" />)}
              <polygon points="0,160 58,148 110,122 164,132 218,96 273,105 327,77 382,87 436,55 491,70 545,41 590,51 640,20 640,190 0,190" fill="url(#chartFill)" />
              <polyline points="0,160 58,148 110,122 164,132 218,96 273,105 327,77 382,87 436,55 491,70 545,41 590,51 640,20" fill="none" stroke="#51a5ff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <div className="chart-months"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span></div>
        </article>

        <article className="panel pipeline-panel">
          <div className="panel-title"><div><h2>Deal pipeline</h2><p className="muted">Opportunities by stage</p></div><button className="text-button" onClick={() => navigate('/deals')}>View deals →</button></div>
          <div className="pipeline-list">
            {['Qualified', 'Proposal', 'Negotiation', 'Won'].map((stage, index) => {
              const count = records.filter((record) => record.type === 'deals' && record.status.toLowerCase() === stage.toLowerCase()).length;
              const widths = [100, 78, 58, 36];
              return <div className="pipeline-row" key={stage}><div className="pipeline-track"><span style={{ width: `${widths[index]}%` }} /></div><div className="pipeline-meta"><span>{stage}</span><strong>{count}</strong></div></div>;
            })}
          </div>
          <div className="panel-foot"><span>Open pipeline</span><strong>{overview.deals} opportunities</strong></div>
        </article>

        <article className="panel projects-panel">
          <div className="panel-title"><div><h2>Project progress</h2><p className="muted">Current delivery status</p></div><button className="text-button" onClick={() => navigate('/projects')}>View all →</button></div>
          <div className="donut-row"><div className="donut-chart"><div><strong>{overview.projects}</strong><span>Projects</span></div></div><div className="legend-list"><p><i className="legend-dot green" /> Completed <strong>{records.filter((record) => record.type === 'projects' && record.status === 'Completed').length}</strong></p><p><i className="legend-dot blue" /> In progress <strong>{records.filter((record) => record.type === 'projects' && record.status === 'In progress').length}</strong></p><p><i className="legend-dot orange" /> On hold <strong>{records.filter((record) => record.type === 'projects' && record.status === 'On hold').length}</strong></p></div></div>
        </article>

        <article className="panel insights-panel">
          <div className="panel-title"><div><h2>AI insights</h2><p className="muted">Suggestions from your live CRM data</p></div><span className="ai-mark">✦</span></div>
          <div className="insight-item"><span className="insight-icon purple">↗</span><div><strong>Follow up on qualified leads</strong><p>{overview.leads} leads are in your pipeline. Keep response times short.</p></div></div>
          <div className="insight-item"><span className="insight-icon orange">!</span><div><strong>Check your support queue</strong><p>{overview.openTickets} tickets are still open and may need attention.</p></div></div>
          <div className="insight-item"><span className="insight-icon blue">✓</span><div><strong>Stay ahead of deadlines</strong><p>{overview.dueToday} tasks are marked as due today.</p></div></div>
          <p className="disclaimer">Insights are based on your saved CRM records.</p>
        </article>

        <article className="panel activity-panel">
          <div className="panel-title"><div><h2>Recent activity</h2><p className="muted">Latest updates in your workspace</p></div><button className="text-button" onClick={() => navigate('/notifications')}>View all →</button></div>
          {records.slice(0, 5).map((record, index) => <div className="activity-row" key={record.id}><span className={`activity-icon activity-${index % 4}`}>{record.type === 'leads' ? '◎' : record.type === 'projects' ? '▣' : record.type === 'tickets' ? '◈' : '♙'}</span><div><strong>{record.name}</strong><p>{record.detail || `${titles[record.type]} · ${record.company || record.status}`}</p></div><time>{shortDate(record.updatedAt)}</time></div>)}
          {records.length === 0 && <p className="empty-hint">Create a record to see activity here.</p>}
        </article>

        <article className="panel clients-panel">
          <div className="panel-title"><div><h2>Top clients</h2><p className="muted">By deal value</p></div><button className="text-button" onClick={() => navigate('/clients')}>View all →</button></div>
          {records.filter((record) => record.type === 'clients').slice(0, 5).map((client, index) => <div className="client-row" key={client.id}><span className={`client-avatar avatar-${index % 5}`}>{initials(client.name)}</span><strong>{client.name}</strong><span>{money(client.value)}</span></div>)}
        </article>

        <article className="panel tasks-panel">
          <div className="panel-title"><div><h2>Tasks overview</h2><p className="muted">Your team&apos;s to-do list</p></div><button className="text-button" onClick={() => navigate('/tasks')}>Open tasks →</button></div>
          <div className="task-summary"><strong>{overview.tasks}</strong><span>Total tasks</span></div>
          {records.filter((record) => record.type === 'tasks').slice(0, 3).map((task) => <div className="simple-row" key={task.id}><span className={`status-dot ${/today|pending/i.test(task.status) ? 'orange' : 'green'}`} /><span>{task.name}</span><small>{task.status}</small></div>)}
        </article>

        <article className="panel events-panel">
          <div className="panel-title"><div><h2>Upcoming events</h2><p className="muted">Your calendar</p></div><button className="text-button" onClick={() => navigate('/calendar')}>Open calendar →</button></div>
          {records.filter((record) => record.type === 'calendar').slice(0, 3).map((event) => <div className="event-row" key={event.id}><span className="event-date">{event.status}<strong>{shortDate(event.updatedAt)}</strong></span><span><strong>{event.name}</strong><small>{event.company}</small></span><span className="event-time">Scheduled</span></div>)}
          <button className="button button-quiet full-width" onClick={() => openCreate('calendar')}>＋ Add event</button>
        </article>

        <article className="panel deals-panel">
          <div className="panel-title"><div><h2>Deals overview</h2><p className="muted">Your active sales opportunities</p></div><button className="text-button" onClick={() => navigate('/deals')}>Manage deals →</button></div>
          <RecordTable records={records.filter((record) => record.type === 'deals').slice(0, 5)} onStatus={updateStatus} onDelete={deleteRecord} compact />
        </article>
        <article className="panel team-panel">
          <div className="panel-title"><div><h2>Team performance</h2><p className="muted">Your team at a glance</p></div><button className="text-button" onClick={() => navigate('/employees')}>View team →</button></div>
          {records.filter((record) => record.type === 'employees').slice(0, 5).map((member, index) => <div className="team-row" key={member.id}><span className={`client-avatar avatar-${index % 5}`}>{initials(member.name)}</span><strong>{member.name}</strong><span className="team-meter"><i style={{ width: `${92 - index * 7}%` }} /></span><small>{92 - index * 7}%</small></div>)}
        </article>
      </section>
    </>
  );

  const renderRecordsPage = () => (
    <section className="panel records-panel">
      <div className="records-toolbar"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>{getPageTitle()}</h1><p className="muted">Manage and update your {getPageTitle().toLowerCase()}.</p></div><button className="button button-primary" onClick={() => openCreate(sectionType)}>＋ Add {getPageTitle().replace(/s$/, '')}</button></div>
      <div className="table-toolbar"><span>{pageRecords.length} record{pageRecords.length === 1 ? '' : 's'}</span><button className="button button-quiet" onClick={refreshRecords} disabled={loading}>↻ Refresh</button></div>
      <RecordTable records={pageRecords} onStatus={updateStatus} onDelete={deleteRecord} />
    </section>
  );

  const renderUtilityPage = () => {
    if (pathname === '/reports') {
      return <section className="panel utility-panel"><div className="records-toolbar"><div><p className="eyebrow">WORKSPACE EXPORT</p><h1>Reports</h1><p className="muted">Download a spreadsheet of your current CRM records.</p></div><button className="button button-primary" onClick={downloadReport}>↓ Download CSV</button></div><div className="metric-grid report-grid">{Object.entries(titles).map(([type, title]) => <article className="metric-card" key={type}><p>{title}</p><strong>{overview[type] ?? 0}</strong><span>Current saved records</span></article>)}</div><p className="muted">The CSV contains record names, companies, statuses, owners, and values.</p></section>;
    }
    if (pathname === '/analytics') {
      const statusCounts = [...new Set(records.map((record) => record.status))].map((status) => ({ status, count: records.filter((record) => record.status === status).length }));
      return <section className="panel utility-panel"><p className="eyebrow">LIVE WORKSPACE DATA</p><h1>Analytics</h1><p className="muted">A summary calculated from records currently saved in your CRM.</p><div className="metric-grid report-grid"><article className="metric-card tone-blue"><p>Pipeline value</p><strong>{compactMoney(overview.revenue)}</strong><span>Across active deals</span></article><article className="metric-card tone-purple"><p>Open opportunities</p><strong>{overview.deals}</strong><span>Deals in your pipeline</span></article><article className="metric-card tone-green"><p>Customer accounts</p><strong>{overview.clients}</strong><span>Saved client records</span></article><article className="metric-card tone-orange"><p>Support queue</p><strong>{overview.openTickets}</strong><span>Open or in-progress tickets</span></article></div><div className="status-summary">{statusCounts.map((item) => <div className="simple-row" key={item.status}><span className="status-dot blue" /><strong>{item.status}</strong><span className="status-count">{item.count}</span></div>)}</div></section>;
    }
    if (pathname === '/assistant') {
      return <section className="panel utility-panel"><p className="eyebrow">CRM ASSISTANT</p><h1>AI assistant</h1><p className="muted">Practical prompts based on your live workspace data.</p><div className="assistant-card"><span className="ai-mark">✦</span><div><strong>Pipeline follow-up</strong><p>You have {overview.leads} leads and {overview.deals} deals. Prioritize follow-ups with qualified leads and review proposals that have not moved stages.</p></div></div><div className="assistant-card"><span className="insight-icon orange">!</span><div><strong>Team focus</strong><p>There are {overview.dueToday} tasks due today and {overview.openTickets} open support tickets in your workspace.</p></div></div><p className="disclaimer">These suggestions are generated from your stored CRM data; no external AI service is connected.</p></section>;
    }
    if (pathname === '/notifications') {
      const notifications = records.filter((record) => record.type === 'tasks' || record.type === 'tickets').slice(0, 12);
      return <section className="panel utility-panel"><p className="eyebrow">WORKSPACE UPDATES</p><h1>Notifications</h1><p className="muted">Items that may need your attention.</p>{notifications.map((record) => <div className="activity-row notification-row" key={record.id}><span className={`insight-icon ${record.type === 'tickets' ? 'orange' : 'blue'}`}>{record.type === 'tickets' ? '◈' : '☑'}</span><div><strong>{record.name}</strong><p>{record.type === 'tickets' ? `Support ticket · ${record.status}` : `Task · ${record.status}`} {record.company ? `· ${record.company}` : ''}</p></div><time>{shortDate(record.updatedAt)}</time></div>)}{notifications.length === 0 && <p className="empty-hint">No tasks or tickets to show yet.</p>}</section>;
    }
    return <section className="panel utility-panel"><p className="eyebrow">PERSONALIZE YOUR CRM</p><h1>Settings</h1><p className="muted">Update the name shown for your local workspace.</p><form className="settings-form" onSubmit={saveWorkspace}><label>Workspace name<input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} maxLength={60} required /></label><button className="button button-primary" type="submit">Save settings</button></form><div className="connection-card"><span className="connection-indicator" /><div><strong>Backend connection</strong><p>{apiError ? `Disconnected · ${apiError}` : 'Connected to the CEO Vision API'}</p></div><button className="button button-quiet" onClick={refreshRecords}>Test connection</button></div></section>;
  };

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className="sidebar">
        <a className="brand" href="/dashboard" onClick={(event) => { event.preventDefault(); navigate('/dashboard'); }}><span className="brand-mark">✦</span><span>{workspaceName}<small>CLIENT WORKSPACE</small></span></a>
        <p className="nav-label">WORKSPACE</p>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => <a key={item.path} href={item.path} className={`nav-link ${pathname === item.path ? 'active' : ''}`} onClick={(event) => { event.preventDefault(); navigate(item.path); }}><span className="nav-icon">{item.icon}</span><span>{item.label}</span>{item.path === '/notifications' && overview.openTickets > 0 && <span className="nav-badge">{overview.openTickets}</span>}</a>)}
        </nav>
        <p className="nav-label vertical-label">INDUSTRY WORKSPACES</p>
        <nav className="vertical-nav" aria-label="Industry workspaces">
          {verticals.map((item) => <a key={item.slug} href={`/verticals/${item.slug}`} className={`nav-link ${pathname === `/verticals/${item.slug}` ? 'active' : ''}`} onClick={(event) => { event.preventDefault(); navigate(`/verticals/${item.slug}`); }}><span className="nav-icon">{item.icon}</span><span>{item.label}</span></a>)}
        </nav>
        <div className="sidebar-profile"><span className="profile-avatar">{initials(user.name)}</span><span><strong>{user.name}</strong><small>{user.email}</small></span><button className="profile-logout" onClick={onLogout} title="Sign out" aria-label="Sign out">↪</button></div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen((open) => !open)} aria-label="Toggle navigation">☰</button>
          <label className="search-box"><span>⌕</span><input ref={searchRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search anything..." aria-label="Search records" /><kbd>Ctrl K</kbd></label>
          <div className="topbar-actions"><button className="button button-primary top-new" onClick={() => openCreate()}>＋ <span>New</span></button><button className="icon-button" onClick={() => navigate('/notifications')} aria-label="Notifications">♧<i>{overview.openTickets}</i></button><select aria-label="Select industry workspace" value={activeVertical?.slug || ''} onChange={(event) => navigate(event.target.value ? `/verticals/${event.target.value}` : '/dashboard')}><option value="">All industries</option>{verticals.map((item) => <option value={item.slug} key={item.slug}>{item.label}</option>)}</select><span className="top-profile">{initials(user.name)}</span></div>
        </header>

        <main className="content">
          {apiError && <div className="error-banner" role="alert"><span><strong>Backend connection problem.</strong> {apiError}</span><button className="button button-quiet" onClick={refreshRecords}>Try again</button></div>}
          {loading && records.length === 0 && !apiError ? <div className="loading-card"><span className="spinner" /> Connecting to your CRM...</div> : null}
          {!loading && apiError && records.length === 0 ? <div className="connection-error"><span className="error-icon">!</span><h2>Can&apos;t load your CRM data</h2><p>{apiError}</p><p>Start the backend with <code>npm run server</code> in a second terminal, then try again.</p><button className="button button-primary" onClick={refreshRecords}>Retry connection</button></div> : null}
          {activeVertical && <activeVertical.Component overview={overview} />}
          {!activeVertical && (pathname === '/' || pathname === '/dashboard') && renderDashboard()}
          {!activeVertical && sectionType && renderRecordsPage()}
          {!activeVertical && !sectionType && pathname !== '/' && pathname !== '/dashboard' && renderUtilityPage()}
        </main>
        <footer className="app-footer"><span>© 2026 {workspaceName}</span><span><i className={`connection-indicator ${apiError ? 'offline' : ''}`} /> {apiError ? 'API offline' : 'API connected'}</span><span>Built for better business</span></footer>
      </div>

      {sidebarOpen && <button className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      {showModal && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowModal(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="record-modal-title"><div className="modal-heading"><div><p className="eyebrow">ADD TO YOUR WORKSPACE</p><h2 id="record-modal-title">Create a record</h2></div><button className="icon-button" onClick={() => setShowModal(false)} aria-label="Close">×</button></div><form onSubmit={createRecord}><label>Record type<select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>{Object.entries(titles).map(([type, title]) => <option value={type} key={type}>{title}</option>)}</select></label><label>Name<input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} maxLength={120} required autoFocus /></label><label>Company or related account<input value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} maxLength={120} /></label><label>Description<input value={form.detail} onChange={(event) => setForm((current) => ({ ...current, detail: event.target.value }))} maxLength={240} /></label><div className="form-split"><label>Status<input value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} maxLength={60} required /></label><label>Value (INR)<input type="number" min="0" step="1" value={form.value} onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))} /></label></div><label>Owner<input value={form.owner} onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))} maxLength={80} /></label><div className="modal-actions"><button className="button button-quiet" type="button" onClick={() => setShowModal(false)}>Cancel</button><button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create record'}</button></div></form></section></div>}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </div>
  );
}

function RecordTable({ records, onStatus, onDelete, compact = false }) {
  if (!records.length) return <div className="empty-state"><span>⌕</span><strong>No records found</strong><p>Try a different search or add a new record.</p></div>;
  return <div className="table-scroll"><table className={compact ? 'compact-table' : ''}><thead><tr><th>Name</th><th>Company</th><th>Value</th><th>Status</th><th>Owner</th><th aria-label="Actions" /></tr></thead><tbody>{records.map((record, index) => <tr key={record.id}><td><div className="record-name"><span className={`client-avatar avatar-${index % 5}`}>{initials(record.name)}</span><span><strong>{record.name}</strong><small>{record.detail || titles[record.type]}</small></span></div></td><td>{record.company || '—'}</td><td>{Number(record.value) > 0 ? money(record.value) : '—'}</td><td><select className={`status-select ${String(record.status).toLowerCase().replaceAll(' ', '-')}`} value={record.status} onChange={(event) => onStatus(record, event.target.value)} aria-label={`Change ${record.name} status`}><option>{record.status}</option>{['New', 'Active', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'In progress', 'Completed', 'Pending', 'Due today', 'Open', 'Resolved', 'Closed', 'On hold'].filter((status) => status !== record.status).map((status) => <option key={status}>{status}</option>)}</select></td><td><span className="owner-cell"><span className="owner-avatar">{initials(record.owner)}</span>{record.owner || 'Unassigned'}</span></td><td><button className="delete-button" onClick={() => onDelete(record)} aria-label={`Delete ${record.name}`} title="Delete record">×</button></td></tr>)}</tbody></table></div>;
}
