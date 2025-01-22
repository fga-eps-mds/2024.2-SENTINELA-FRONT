import React from 'react';
import "./index.css";

export default function CancelInformationModal() {
    return (
        <>
            <div className="containerInformacao">

                <p className="tituloData">
                    Data de Cancelamento</p>
                <input className="dataConfirmacao"
                    type='date' />

                <textarea className="areaTexto" placeholder='Justificativa...'>

                </textarea>

                <button className="botaoDesfiliar">
                    DESFILIAR
                </button>
                <button className="botaoVoltar">
                    VOLTAR
                </button>
            </div>

        </>
    );
}
