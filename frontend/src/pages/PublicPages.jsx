import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apps = [
  { icon: '⌘', name: 'CRM', detail: 'A clear view of clients, opportunities, and projects.', color: 'blue' },
  { icon: '✉', name: 'Mail', detail: 'Keep customer conversations in one place.', color: 'purple' },
  { icon: '▣', name: 'Books', detail: 'Understand the value moving through your pipeline.', color: 'indigo' },
  { icon: '♙', name: 'People', detail: 'See ownership and activity across your team.', color: 'teal' },
  { icon: '▤', name: 'Payroll', detail: 'Keep your business operations organized.', color: 'green' },
  { icon: '⌘', name: 'Sites', detail: 'Bring your tools and customer data together.', color: 'violet' },
];

function LocalLink({ href, onNavigate, children, className }) {
  return <a className={className} href={href} onClick={(event) => { event.preventDefault(); onNavigate(href); }}>{children}</a>;
}

export function WelcomePage({ onNavigate }) {
  return (
    <div className="public-shell">
      <header className="public-header">
        <LocalLink className="public-brand" href="/" onNavigate={onNavigate}><span>✦</span> CEO VISION</LocalLink>
        <nav className="public-links" aria-label="Main menu">
          <a href="#products">Products <span>⌄</span></a>
          <a href="#solutions">Solutions <span>⌄</span></a>
          <a href="#customers">Customers <span>⌄</span></a>
          <a href="#partners">Partners <span>⌄</span></a>
          <a href="#resources">Resources <span>⌄</span></a>
        </nav>
        <div className="public-actions"><button className="public-search" aria-label="Search">⌕</button><span className="public-language">◎ <span>English</span>⌄</span><LocalLink className="sign-in-link" href="/sign-in" onNavigate={onNavigate}>Sign in</LocalLink><LocalLink className="public-button" href="/sign-up" onNavigate={onNavigate}>Sign up</LocalLink></div>
      </header>

      <main className="public-main">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="hero-pill"><span>✦</span> Smarter tools <i>·</i> Stronger teams <i>·</i> Better results</div>
            <h1>Your life&apos;s work,<br /><span>powered by your life&apos;s work</span></h1>
            <div className="hero-underline" />
            <p>A unique and powerful workspace to help you understand your customers, organize your team, and grow your business.</p>
            <LocalLink className="hero-cta" href="/sign-up" onNavigate={onNavigate}>Get started for free <span>→</span></LocalLink>
            <svg className="hero-wave" viewBox="0 0 720 220" fill="none" aria-hidden="true"><path d="M1 194c115 0 128-9 191-76 63-66 82 48 151-15 72-67 77 20 153-26 81-49 97-100 139-55 31 33 48-6 85-21" stroke="url(#wave)" strokeWidth="2" /><defs><linearGradient id="wave"><stop stopColor="#1741a1" stopOpacity="0" /><stop offset=".66" stopColor="#1459ff" /><stop offset="1" stopColor="#36b3ff" /></linearGradient></defs></svg>
          </div>
          <section className="featured-panel" id="products">
            <div className="featured-heading"><span>Featured products</span><i /></div>
            <div className="featured-grid">{apps.map((app) => <article className="featured-card" key={app.name}><span className={`featured-icon ${app.color}`}>{app.icon}</span><div><h2>{app.name}</h2><p>{app.detail}</p></div></article>)}</div>
            <LocalLink className="explore-link" href="/sign-up" onNavigate={onNavigate}>Explore the workspace <span>›</span></LocalLink>
          </section>
        </section>

        <section className="promo-row" aria-label="Explore CEO Vision">
          <LocalLink className="promo-card promo-catalyst" href="/sign-up" onNavigate={onNavigate}><span>WORKSPACE BUILDER</span><strong><i>◈</i> Catalyst</strong><small>Build a better way to work</small></LocalLink>
          <LocalLink className="promo-card promo-agents" href="/sign-up" onNavigate={onNavigate}><span>SMARTER WORKFLOWS</span><strong><i>✦</i> AI Insights</strong><small>Make your next move with confidence</small></LocalLink>
        </section>

        <section className="public-bottom" id="solutions"><span>One workspace. A clearer picture.</span><p>Start with a free account and explore your connected business dashboard.</p><LocalLink href="/sign-up" onNavigate={onNavigate}>Create your account →</LocalLink></section>
      </main>
      <footer className="public-footer"><LocalLink className="public-brand" href="/" onNavigate={onNavigate}><span>✦</span> CEO VISION</LocalLink><span>© 2026 CEO Vision · Business, in focus.</span><LocalLink href="/sign-in" onNavigate={onNavigate}>Already have an account? Sign in</LocalLink></footer>
    </div>
  );
}

export function AuthPage({ mode, onNavigate, onAuthenticated }) {
  const isSignup = mode === 'signup';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/auth/${isSignup ? 'signup' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'We could not sign you in. Please try again.');
      if (!data.token || !data.user) throw new Error('The server returned an incomplete sign-in response.');
      onAuthenticated(data);
    } catch (requestError) {
      setError(requestError instanceof TypeError ? 'Could not connect to the server. Start the backend and try again.' : requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <header className="auth-header"><LocalLink className="public-brand" href="/" onNavigate={onNavigate}><span>✦</span> CEO VISION</LocalLink><span>Already have an account? {!isSignup && <strong>Sign in</strong>}{isSignup && <LocalLink href="/sign-in" onNavigate={onNavigate}>Sign in</LocalLink>}</span></header>
      <main className="auth-main">
        <section className="auth-promo">
          <div className="hero-pill"><span>✦</span> Smarter tools · Stronger teams</div>
          <h1>Your business,<br /><span>all in one view.</span></h1>
          <p>Make room for your best work. Bring customers, deals, projects, and your team together in a workspace that works for you.</p>
          <div className="auth-stat-row"><div><strong>01</strong><span>One connected workspace</span></div><div><strong>∞</strong><span>Room to grow</span></div></div>
          <div className="auth-glow" />
        </section>

        <section className="auth-card">
          <div className="auth-card-heading"><span className="auth-logo">✦</span><p className="eyebrow">{isSignup ? 'START YOUR WORKSPACE' : 'WELCOME BACK'}</p><h2>{isSignup ? 'Create your account' : 'Sign in to your account'}</h2><p>{isSignup ? 'Get started with your CEO Vision workspace.' : 'Enter your details to continue to your workspace.'}</p></div>
          <form onSubmit={submit} className="auth-form">
            {isSignup && <label>Your name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Alex Morgan" minLength={2} maxLength={80} required /></label>}
            <label>Work email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required /></label>
            <label>Password<span className="password-wrap"><input type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'} minLength={isSignup ? 8 : undefined} maxLength={128} required /><button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Hide' : 'Show'}</button></span></label>
            {!isSignup && <div className="auth-options"><label className="remember-option"><input type="checkbox" /> <span>Remember me</span></label><span>Secure sign in</span></div>}
            {error && <div className="auth-error" role="alert">{error}</div>}
            <button className="hero-cta auth-submit" type="submit" disabled={submitting}>{submitting ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'} <span>→</span></button>
          </form>
          <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to CEO Vision?'} <LocalLink href={isSignup ? '/sign-in' : '/sign-up'} onNavigate={onNavigate}>{isSignup ? 'Sign in' : 'Create an account'}</LocalLink></p>
          <p className="auth-privacy">Your password is securely encrypted. Your data stays in your local workspace.</p>
        </section>
      </main>
      <footer className="public-footer auth-footer"><span>© 2026 CEO Vision</span><span>Secure account access</span></footer>
    </div>
  );
}
