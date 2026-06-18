import Orders from '../components/Orders/Orders';
import { AdminWideShell } from '../components/layout/AdminPageShell.jsx';

function ViewOrders() {
  return (
    <AdminWideShell
      eyebrow="Panel de administración"
      title="Órdenes"
      titleId="orders-heading"
    >
      <Orders />
    </AdminWideShell>
  );
}

export default ViewOrders;
