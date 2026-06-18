import { useState } from 'react';
import Sidebar from '../components/Siderbar/Sidebar';
import TableProducts from '../components/Products/TableProducts';
import ModalViewProduct from '../components/Products/ModalViewProduct';

function DashboardAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [idProduct, setIdProduct] = useState('');

  const viewProduct = (id) => {
    setIdProduct(id);
    setIsOpen(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] w-full flex-col bg-stone-50 lg:flex-row">
      <Sidebar />
      <section
        aria-label="Panel de productos"
        className="flex-1 overflow-auto p-6 lg:p-10"
      >
        <TableProducts viewProduct={viewProduct} />
      </section>
      {isOpen && (
        <ModalViewProduct
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          idProduct={idProduct}
        />
      )}
    </div>
  );
}

export default DashboardAdmin;
