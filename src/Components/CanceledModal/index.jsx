/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "./index.css";

export default function CanceledModal({ onClose }) {
  return (
    <>
      <div className="alertaExclusao">
        <div className="caixaTextoMensagem">
          <p className="textoMensagem">Mensalidade Cancelada</p>
          <button className="botaoFechar" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </>
  );
}
