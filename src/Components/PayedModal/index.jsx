import React from "react";
import "./index.css";

export default function PayedModal({ onClose }) {
  return (
    <>
      <div className="alertaExclusao">
        <div className="caixaTextoMensagem">
          <p className="textoMensagem">Mensalidade Quitada</p>
          <button className="botaoFechar" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </>
  );
}
