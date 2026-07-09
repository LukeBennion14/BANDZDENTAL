import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/insight': 'Insights',
  '/app/schedule': 'Schedule',
  '/app/patients': 'Patients',
  '/app/review': 'Review',
  '/app/settings': 'Settings',
};

export default function Layout() {
  const location = useLocation();

  let title = pageTitles[location.pathname] || 'Dashboard';
  if (location.pathname.startsWith('/app/patients/') && location.pathname.includes('/review')) {
    title = 'Review Photos';
  } else if (location.pathname.startsWith('/app/patients/') && location.pathname !== '/app/patients') {
    title = 'Patient Profile';
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#000000',
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header title={title} />
        <main
          style={{
            flex: 1,
            padding: '32px',
            overflow: 'auto',
            background: '#000000',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
