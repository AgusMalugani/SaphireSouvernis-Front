// DashboardAdmin.js
import React, { useState } from "react";
import Sidebar from "../components/Siderbar/Sidebar";
import TableProducts from "../components/Products/TableProducts";
import ModalViewProduct from "../components/Products/ModalViewProduct";

function DashboardAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [idProduct, setIdProduct] = useState("");

  const viewProduct = (id) => {
    setIdProduct(id);
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4">
        <TableProducts viewProduct={viewProduct} />
      </main>
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
