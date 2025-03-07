import React from 'react'
import Modal from 'react-modal'

function ModalCreateOrder({isOpen,onClose}) {
  return (
    <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
              content: { padding: "20px", width: "300px", margin: "auto" },
            }}
          >

            <form>
                <p>Nombre completo</p>
                <p> Nombre tarjeta </p>
                <p> telefono </p>
            </form>

            <button onClick={onClose}>Cerrar</button>
          </Modal>
  )
}

export default ModalCreateOrder
