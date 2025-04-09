import React from 'react'
import Modal from 'react-modal';
import ViewBuyOrder from './ViewBuyOrder';
import EditOrder from './EditOrder';

function ModalActionOrder({ isOpen, onClose, id, action }) {
  return (
    <Modal
      isOpen={isOpen}
      appElement={document.getElementById('root') || undefined}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        content: {
          padding: "20px",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "90vh",
          margin: "auto",
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
          backgroundColor: "#fff",
          position: "relative",
          overflowY: "auto",
          transition: "all 0.3s ease"
        }
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "#eee",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          fontSize: "18px",
          cursor: "pointer",
          fontWeight: "bold",
          color: "#333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        title="Cerrar"
      >
        ✖
      </button>

      {action === "ver" && <ViewBuyOrder id={id} />}
      {(action === "estadoPago" || action === "envio/Retiro") && (
        <EditOrder id={id} action={action} onClose={onClose} />
      )}
    </Modal>
  )
}

export default ModalActionOrder
