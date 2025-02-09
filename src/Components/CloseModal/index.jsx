/* eslint-disable no-unused-vars */
import React from "react";
import "./index.css";

export default function CloseModal() {
  return (
    <>
      <div className="alertaExclusao">
        <div className="caixaTextoMensagem">
          <p className="textoMensagem">Mensalidade Cancelada</p>
          <button className="botaoFechar">OK</button>
        </div>
      </div>
    </>
  );
}
