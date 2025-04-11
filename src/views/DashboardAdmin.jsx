import React, { useState } from "react";
import Sidebar from "../components/Siderbar/Sidebar";
import TableProducts from "../components/Products/TableProducts";
import ModalViewProduct from "../components/Products/ModalViewProduct";
import styles from "./css/DashboardAdmin.module.css";

function DashboardAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [idProduct, setIdProduct] = useState("");

  const viewProduct = (id) => {
    setIdProduct(id);
    setIsOpen(true);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <TableProducts viewProduct={viewProduct} />
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
