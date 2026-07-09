import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BarChart3, Calendar, Users, ClipboardCheck, Settings, LogOut } from 'lucide-react';
import { clearSession } from '../auth';

const navItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: Home },
  { path: '/app/insight', label: 'Insight', icon: BarChart3 },
  { path: '/app/schedule', label: 'Schedule', icon: Calendar },
  { path: '/app/patients', label: 'Patients', icon: Users },
  { path: '/app/review', label: 'Review', icon: ClipboardCheck },
  { path: '/app/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 16px 24px',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '4px 12px 40px' }}>
        <img
          src="/BANDZLOGO.jpg"
          alt="BANDZ"
          style={{
            height: '32px',
            width: 'auto',
            objectFit: 'contain',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '-0.012em',
                  color: isActive ? '#4ade80' : 'rgba(245,245,247,0.72)',
                  background: isActive ? 'rgba(74,222,128,0.10)' : 'transparent',
                  transition: 'background-color 120ms ease, color 120ms ease',
                })}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout — pinned to bottom, subtle */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '11px 14px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '-0.012em',
          color: 'rgba(245,245,247,0.62)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'background-color 120ms ease, color 120ms ease',
          marginTop: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.color = '#f5f5f7';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'rgba(245,245,247,0.62)';
        }}
      >
        <LogOut size={18} strokeWidth={1.75} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
