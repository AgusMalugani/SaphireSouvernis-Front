import React from 'react'

function SidebarItem({ icon, text }) {
    return (
      <div
        style={{display: "flex",alignItems: "center",gap: "10px",padding: "10px",width: "100%",cursor: "pointer",transition: "background 0.2s",}}
        onMouseOver={(e) => (e.currentTarget.style.background = "#444")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>
        {icon}
        <span>{text}</span>
      </div>
    );
  }
  

export default SidebarItem
