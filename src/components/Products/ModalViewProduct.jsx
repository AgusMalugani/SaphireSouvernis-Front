import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { OneProductById } from '../../services/Products/OneProductById';
import { HiX } from 'react-icons/hi';

function ModalViewProduct({ isOpen, onClose, idProduct }) {
  const [product, setProduct] = useState({
    img_url: '',
    name: '',
    details: '',
    price: 0,
    stock: true,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await OneProductById(idProduct);
        setProduct(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [idProduct]);

  return (
    <Modal
      isOpen={isOpen}
      appElement={document.getElementById('root') || undefined}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          inset: 'unset',
          padding: 0,
          border: 'none',
          background: 'none',
          overflow: 'visible',
        },
      }}
    >
      <div className="relative bg-white/90 backdrop-blur-md border border-white/60 rounded-3xl shadow-2xl w-[90vw] max-w-sm overflow-hidden">

        {/* Botón de cierre */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-rose-50 hover:text-rose-500 transition-colors duration-200"
        >
          <HiX size={16} />
        </button>

        {/* Imagen del producto */}
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={product.img_url || undefined}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detalles */}
        <div className="p-5 flex flex-col gap-2">
          <h2 className="font-display text-xl text-stone-800 font-semibold leading-snug">
            {product.name}
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            {product.details}
          </p>
          <p className="text-rose-500 font-bold text-lg mt-1">
            ${product.price}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default ModalViewProduct;
