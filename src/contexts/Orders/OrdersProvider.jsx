import React, { useContext, useEffect, useState } from 'react'
import { OrdersContext } from './OrdersContext'
import { FindAllOrders } from '../../services/Orders/FindAllOrders';
import { AuthContext } from './../Auth/AuthContext';
import { EditOrderService } from '../../services/Orders/EditOrderService';

function OrdersProvider({children}) {
    const[orders,setOrders]=useState([]);
    const {token}=useContext(AuthContext)

    const getOrderById=(id)=>{
        const orderId = orders.find(ord => ord.id === id)
        return orderId
    }

    const editOrderContext= async (id,order)=>{
         const response = await EditOrderService(id, order);
         const ordersMod = orders.map(ord=>{ 
            if(ord.id === id){
             return response
            }else{
                return ord
            }
            })
         setOrders(ordersMod)
         return response;
    }

    useEffect(() => {
        if(token){
            const response = async () => {
                const resp = await FindAllOrders()
                setOrders(resp);
              }
              response()
        }else{
            setOrders([])
        }
        
      }, [token])
    
    const value = {
        orders,
        setOrders,
        getOrderById,
        editOrderContext
    }
  return (
<OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>  
)
}

export default OrdersProvider
