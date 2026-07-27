import { useState } from 'react';
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
    <div className="min-h-screen w-full bg-stone-50">
      <section
        aria-label="Panel de productos"
        className="overflow-auto p-6 lg:p-10"
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
