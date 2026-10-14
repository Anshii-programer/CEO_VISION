import { useCallback, useEffect, useState } from 'react';
import MainDashboard from './pages/MainDashboard';
import { AuthPage, WelcomePage } from './pages/PublicPages';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'ceo-vision-token';

function getPath() {
  return `${window.location.pathname}${window.location.search}`;
}

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [restoringSession, setRestoringSession] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  const navigate = useCallback((path, replace = false) => {
    if (getPath() !== path) {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', path);
    }
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    const updatePath = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  useEffect(() => {
    if (token && user && ['/', '/sign-in', '/sign-up'].includes(pathname)) {
      navigate('/dashboard', true);
    } else if (!token && !restoringSession && !['/', '/sign-in', '/sign-up'].includes(pathname)) {
      navigate('/sign-in', true);
    }
  }, [navigate, pathname, restoringSession, token, user]);

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Your session is no longer valid.');
        if (!data.user) throw new Error('The server returned an incomplete session.');
        if (!cancelled) {
          setUser(data.user);
          setRestoringSession(false);
          if (window.location.pathname === '/') navigate('/dashboard', true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          setRestoringSession(false);
          if (!['/', '/sign-in', '/sign-up'].includes(window.location.pathname)) navigate('/sign-in', true);
        }
      });
    return () => { cancelled = true; };
  }, [navigate, token]);

  const handleAuthenticated = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    sessionStorage.removeItem('ceo-vision-return-to');
    setToken(nextToken);
    setUser(nextUser);
    navigate('/dashboard', true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setRestoringSession(false);
    navigate('/', true);
  };

  if (restoringSession) {
    return <main className="session-loading"><span className="spinner" /><p>Opening your workspace...</p></main>;
  }

  if (token && user) {
    return <MainDashboard user={user} onLogout={logout} />;
  }

  if (pathname === '/sign-in' || pathname === '/sign-up') {
    return <AuthPage mode={pathname === '/sign-up' ? 'signup' : 'login'} onNavigate={navigate} onAuthenticated={handleAuthenticated} />;
  }

  if (pathname !== '/') {
    return <AuthPage mode="login" onNavigate={navigate} onAuthenticated={handleAuthenticated} />;
  }

  return <WelcomePage onNavigate={navigate} />;
}