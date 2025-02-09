/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import "./index.css";

export default function CancelInformationModal({
  onClose,
  onConfirm,
  cancelDate,
  setCancelDate,
  justification,
  setJustification,
}) {
  return (
    <>
      <div className="containerInformacao">
        <p className="tituloData">Data de Cancelamento</p>
        <input
          className="dataConfirmacao"
          type="date"
          value={cancelDate}
          onChange={(e) => setCancelDate(e.target.value)}
          required
        />

        <textarea
          className="areaTexto"
          placeholder="Justificativa..."
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          required
        ></textarea>
        <button className="botaoDesfiliar" onClick={onClose}>
          VOLTAR
        </button>
        <button className="botaoVoltar" onClick={onConfirm}>
          DESFILIAR
        </button>
      </div>
    </>
  );
}
