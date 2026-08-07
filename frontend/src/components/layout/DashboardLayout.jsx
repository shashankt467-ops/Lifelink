import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useApp } from '../../context/AppContext';

export default function DashboardLayout() {
  const { sidebarOpen } = useApp();

  return (
    <div className="app-shell">
      <Sidebar />
      <div
        className="main-content"
        style={{ marginLeft: sidebarOpen ? 260 : 72, transition: 'margin-left 0.25s ease' }}
      >
        <TopBar />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
