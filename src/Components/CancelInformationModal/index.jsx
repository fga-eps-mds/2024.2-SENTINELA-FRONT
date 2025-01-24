import React from 'react';
import "./index.css";

export default function CancelInformationModal({ onClose, onConfirm }) {
    return (
        <>
            <div className="containerInformacao">
                <p className="tituloData">Data de Cancelamento</p>
                <input className="dataConfirmacao" type='date' />

                <textarea className="areaTexto" placeholder='Justificativa...'></textarea>

                <button className="botaoDesfiliar" onClick={onConfirm}>
                    DESFILIAR
                </button>
                <button className="botaoVoltar" onClick={onClose}>
                    VOLTAR
                </button>
            </div>
        </>
    );
}