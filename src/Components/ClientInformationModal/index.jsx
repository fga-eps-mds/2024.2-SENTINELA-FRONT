import React from 'react';
import "./index.css";

export default function ClientInformationModal({ transaction, onClose, onQuitado, onDesfiliar }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="containerInformacao">
                    <p className="tituloTitular">TITULAR</p>
                    <p className="nomeTitular">{transaction?.name}</p>

                    <p className="tituloCpf">CPF</p>
                    <p className="cpfTitular">{transaction?.cpf}</p>

                    <p className="tituloStatus">STATUS</p>
                    <p className="statusTitular">{transaction?.currentStatus}</p>

                    <button className="botaoParaDesfiliar" onClick={onDesfiliar}>
                        DESFILIAR
                    </button>
                    <button className="botaoParaVoltar" onClick={onClose}>
                        VOLTAR
                    </button>
                    <button className="botaoQuitar" onClick={onQuitado}>
                        QUITAR
                    </button>
                </div>
            </div>
        </div>
    );
}