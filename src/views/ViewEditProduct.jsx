import EditProduct from '../components/Products/EditProduct';
import { AdminGlassCard, AdminPageShell } from '../components/layout/AdminPageShell.jsx';

function ViewEditProduct() {
  return (
    <AdminPageShell
      title="Modificar producto"
      titleId="edit-product-heading"
      centered
      showBackToDashboard
    >
      <AdminGlassCard>
        <EditProduct />
      </AdminGlassCard>
    </AdminPageShell>
  );
}

export default ViewEditProduct;
