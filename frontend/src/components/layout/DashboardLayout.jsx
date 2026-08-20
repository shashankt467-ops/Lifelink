import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useApp } from '../../context/AppContext';

export default function DashboardLayout() {
  const { sidebarOpen } = useApp();

  return (
    <div className="app-shell" style={{ perspective: 1200, transformStyle: 'preserve-3d' }}>
      <Sidebar />
      <div
        className="main-content"
        style={{
          marginLeft: sidebarOpen ? 260 : 72,
          transition: 'margin-left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          perspective: 1200,
          transformStyle: 'preserve-3d',
        }}
      >
        <TopBar />
        <main className="page-container" style={{ perspective: 1200, transformStyle: 'preserve-3d' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
