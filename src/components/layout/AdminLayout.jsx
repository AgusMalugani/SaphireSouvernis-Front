import { Outlet } from 'react-router-dom';
import Sidebar from '../Siderbar/Sidebar';

function AdminLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-stone-50">
      {/* Desktop sidebar fijo */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-56 lg:flex-col">
        <Sidebar variant="desktop" />
      </aside>

      {/* Mobile: header + drawer overlay */}
      <div className="sticky top-0 z-30 lg:hidden">
        <Sidebar variant="mobile" />
      </div>

      <main className="w-full max-w-full min-w-0 lg:pl-56">
        <div className="min-h-screen w-full max-w-full min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
