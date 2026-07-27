import { Outlet } from 'react-router-dom';
import Sidebar from '../Siderbar/Sidebar';

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar persistente */}
      <aside className="hidden lg:block lg:fixed lg:inset-y-0 lg:z-10 lg:w-56">
        <Sidebar />
      </aside>

      {/* Mobile header con sidebar colapsable */}
      <div className="lg:hidden">
        <Sidebar />
      </div>

      {/* Contenido principal con offset para el sidebar en desktop */}
      <main className="w-full lg:pl-56">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
