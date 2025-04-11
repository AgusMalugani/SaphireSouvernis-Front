import { FaHome } from "react-icons/fa";
import { BiNotepad } from "react-icons/bi";
import { AiFillProduct } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      <div className={styles.item}>
        <FaHome />
        <button className={styles.button} onClick={() => navigate("/")}>Inicio</button>
      </div>

      <div className={styles.item}>
        <AiFillProduct />
        <button className={styles.button} onClick={() => navigate("/product/create")}>Cargar Productos</button>
      </div>

      <div className={styles.item}>
        <AiFillProduct />
        <button className={styles.button} onClick={() => navigate("/")}>Editar Productos</button>
      </div>

      <div className={styles.item}>
        <BiNotepad />
        <button className={styles.button} onClick={() => navigate("/orders")}>Pedidos</button>
      </div>
    </div>
  );
}
