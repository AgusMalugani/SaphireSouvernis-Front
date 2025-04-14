import React, { useContext, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { fetchCreateOrder } from '../../services/Orders/CreateOrder.service'; 
import { useNavigate } from 'react-router-dom';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import { onValidateOrder } from '../../formValidations/OnValidateOrder';
import { toast } from 'react-toastify';

function ModalCreateOrder({isOpen,onClose,products}) {  
  const navigate = useNavigate()
  const{setOrders}= useContext(OrdersContext)
  const [orderForm,setOrderForm] = useState({
    endOrder:"",
    transactionType:"",
    address:"",
    theme:"",
    nameClient:"",
    nameForCard:"",
    numCel:"",
    num2Cel:"",
    products:[],
    email:""
  });
  const[errors,setErrors]=useState(null)
  useEffect(() => {
    if (products && products.length > 0) {
      setOrderForm((prevOrderForm) => ({
        ...prevOrderForm,
        products
      }));
    }
  }, [products]);

  const handleOnChange=(event)=>{
const {name,value}=event.target
setOrderForm({...orderForm,[name]:value})
  }

  

  const handleOnSubmit=async (e)=>{
    e.preventDefault();
    const errores = onValidateOrder(orderForm)
   
    if(!errores){
   // const newOrder= await fetchCreateOrder(orderForm); 
    const newOrder= await toast.promise(
      fetchCreateOrder(orderForm),
      {
        pending: 'Creando orden...',
        success: 'Orden creada ✅',
        error: 'Falló 😓'
      }
    );
    setOrders((prevOrders)=>[...prevOrders,newOrder])
   //  alert("Orden creada")
     setErrors(null)
     onClose()
     navigate(`/postShop/${newOrder.id}`)
   } else{
   // alert("Hubo errores en el formulario.")
   toast.error("Hubo errores en el formulario.") 
   setErrors(errores)
   }
   
  }

  return (
    <Modal
    isOpen={isOpen}
    appElement={document.getElementById('root') || undefined}
    onRequestClose={onClose}
    shouldCloseOnOverlayClick={false} // Evita cerrar el modal al hacer clic fuera
    style={{overlay: { backgroundColor: "rgba(0, 0, 0, 0.8)",}, // Fondo oscuro para desactivar la página position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, // Asegura que el modal esté por encima de todo
  content: { padding: "20px",  width: "50%",  maxWidth: "500px",  margin: "auto",  borderRadius: "10px",  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",  backgroundColor: "#fff",  position: "relative",  maxHeight: "80vh", // Limita la altura máxima del moda 
   overflow: "auto", // Agrega barra de desplazamiento si el contenido es larg 
    }, }}>
    
    <button
      onClick={onClose}
      style={{ position: "absolute", top: "10px", right: "10px", background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", fontWeight: "bold", color: "#555",}}>
      ✖
    </button>
  
    <form onSubmit={handleOnSubmit}
      style={{display: "flex",flexDirection: "column",gap: "10px",}}>
      <label style={{ fontWeight: "bold" }}>
        Nombre completo
        <input type="text" name="nameClient" value={orderForm.nameClient} onChange={handleOnChange}
          style={{width: "100%", padding: "8px", marginTop: "4px", borderRadius: "5px", border: "1px solid #ccc",}}/>
      </label>
      {errors && errors.nameClient && ( <p style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '8px 12px',borderRadius: '4px',fontSize: '0.9rem',marginTop: '4px',marginBottom: '4px',fontWeight: '500'}}>
    {errors.nameClient}
  </p>)}

  
      <label style={{ fontWeight: "bold" }}>
        Nombre para tarjeta
        <input type="text" name='nameForCard' value={orderForm.nameForCard} onChange={handleOnChange}
          style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "5px", border: "1px solid #ccc",}}/>
      </label>
      {errors && errors.nameForCard && ( <p style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '8px 12px',borderRadius: '4px',fontSize: '0.9rem',marginTop: '4px',marginBottom: '4px',fontWeight: '500'}}>
    {errors.nameForCard}
  </p>)}

      <label style={{ fontWeight: "bold" }}>
        Email
        <input type="email" name="email" value={orderForm.email} onChange={handleOnChange}
          style={{width: "100%", padding: "8px", marginTop: "4px", borderRadius: "5px", border: "1px solid #ccc",}}/>
      </label>
      {errors && errors.email && ( <p style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '8px 12px',borderRadius: '4px',fontSize: '0.9rem',marginTop: '4px',marginBottom: '4px',fontWeight: '500'}}>
    {errors.email}
  </p>)}
  
      <label style={{ fontWeight: "bold", display: "block" }}>
      Forma de entrega
      <select style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "5px", border: "1px solid #ccc",}}
        name='transactionType'
        value={orderForm.transactionType}
        onChange={handleOnChange}>
        <option value={""}> Seleccione Envio - Retiro </option>
        <option value={"withdraw"}>Retiro en local</option>
        <option value={"send"}>Envío</option>
      </select>

        <div style={{ marginTop: "10px" }}>
          <label style={{ fontWeight: "bold" }}>
            Dirección de envío
            <input name='address' value={orderForm.address} onChange={handleOnChange}
              type="text"
              style={{width: "100%",padding: "8px",marginTop: "4px",borderRadius: "5px",border: "1px solid #ccc",}}
              placeholder="Ingrese su dirección"/>
          </label>
          {errors && errors.address && ( <p style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '8px 12px',borderRadius: '4px',fontSize: '0.9rem',marginTop: '4px',marginBottom: '4px',fontWeight: '500'}}>
    {errors.address}
  </p>)}
        </div>
    </label>
  
      <label style={{ fontWeight: "bold" }}>
        Tema
<textarea name='theme' value={orderForm.theme} onChange={handleOnChange}
 style={{width: "100%",padding: "8px",marginTop: "4px",borderRadius: "5px",border: "1px solid #ccc",}} />
      </label>
      {errors && errors.theme && ( <p style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '8px 12px',borderRadius: '4px',fontSize: '0.9rem',marginTop: '4px',marginBottom: '4px',fontWeight: '500'}}>
    {errors.theme}
  </p>)}
  
      <label style={{ fontWeight: "bold" }}>
        Teléfono principal
        <input type="text" name='numCel' value={orderForm.numCel} onChange={handleOnChange}
          style={{width: "100%", padding: "8px", marginTop: "4px", borderRadius: "5px", border: "1px solid #ccc",}} />
      </label>
      {errors && errors.numCel && ( <p style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '8px 12px',borderRadius: '4px',fontSize: '0.9rem',marginTop: '4px',marginBottom: '4px',fontWeight: '500'}}>
    {errors.numCel}
  </p>)}

      <label style={{ fontWeight: "bold" }}>
        Teléfono secundario
        <input type="text" name='num2Cel' value={orderForm.num2Cel} onChange={handleOnChange}
         style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "5px", border: "1px solid #ccc",}} />
      </label>
      {errors && errors.num2Cel && ( <p style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '8px 12px',borderRadius: '4px',fontSize: '0.9rem',marginTop: '4px',marginBottom: '4px',fontWeight: '500'}}>
    {errors.num2Cel}
  </p>)}

      <label style={{ fontWeight: "bold" }}>
        Fecha evento
        <input type="date" name='endOrder' value={orderForm.endOrder} onChange={handleOnChange}
         style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "5px", border: "1px solid #ccc",}} />
      </label>
  
      <button
      style={{ marginTop: "15px", padding: "10px", width: "100%", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer",}} >      
      Crear orden
    </button>

    </form>
  
  </Modal>
  
  )
}

export default ModalCreateOrder
