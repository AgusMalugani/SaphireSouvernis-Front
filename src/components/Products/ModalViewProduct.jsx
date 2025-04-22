import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { OneProductById } from '../../services/Products/OneProductById';

function ModalViewProduct({ isOpen, onClose, idProduct }) {
  const [product, setProduct] = useState({
    img_url: "",
    name: "",
    details: "",
    price: 0,
    stock: true,
  });

  useEffect(() => {
    const response = async () => {
      try {
        const resp = await OneProductById(idProduct);
        setProduct(resp);
      } catch (error) {
        console.log(error);
      }
    };
    response();
  }, [idProduct]);

  return (
    <Modal
      isOpen={isOpen}
      appElement={document.getElementById('root') || undefined}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          inset: 'unset', // elimina top/right/bottom/left predeterminados
          padding: 0,
          border: 'none',
          background: 'none',
          overflow: 'visible',
        }
    ,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          fontWeight: "bold",
          color: "#555",
        }}
      >
        ✖
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <img
          src={product.img_url || null}
          alt={product.name}
          style={{
            width: "100%",
            maxHeight: "300px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        />
        <span style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>
          {product.name}
        </span>
        <span style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
          {product.details}
        </span>
        <span style={{ fontSize: "16px", fontWeight: "600", color: "#28a745", marginBottom: "10px" }}>
          ${product.price}
        </span>
      </div>
    </Modal>
  );
}

export default ModalViewProduct;
